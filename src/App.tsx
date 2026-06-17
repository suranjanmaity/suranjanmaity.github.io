import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, User, Code2, Database, Zap, Sun, Moon, Trash2, ArrowDown, Search, Menu, ChevronLeft, History } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const escapeRegExp = (str: string) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const stemWord = (w: string): string => {
  w = w.toLowerCase().trim();
  // Irregular verb normalization
  if (w === 'made' || w === 'making' || w === 'makes' || w === 'make') return 'make';
  if (w === 'built' || w === 'building' || w === 'builds' || w === 'build') return 'build';
  if (w === 'created' || w === 'creating' || w === 'creates' || w === 'create') return 'create';
  if (w === 'done' || w === 'doing' || w === 'does' || w === 'did' || w === 'do') return 'do';
  if (w === 'gone' || w === 'going' || w === 'goes' || w === 'go') return 'go';
  
  // Plurals and suffixes
  if (w.endsWith('sses')) return w.slice(0, -2);
  if (w.endsWith('ies')) return w.slice(0, -3) + 'y';
  if (w.endsWith('ss')) return w;
  if (w.endsWith('s') && w.length > 3) w = w.slice(0, -1);
  
  if (w.endsWith('ing') && w.length > 5) {
    w = w.slice(0, -3);
    if (w.length > 3 && w[w.length - 1] === w[w.length - 2]) {
      w = w.slice(0, -1);
    }
  } else if (w.endsWith('ed') && w.length > 4) {
    w = w.slice(0, -2);
  }
  
  // Tech root normalization
  if (w === 'scal') return 'scale';
  if (w === 'cach') return 'cache';
  if (w === 'cod') return 'code';
  
  return w;
};

const getKeywords = (text: string): Set<string> => {
  const stopWords = new Set([
    'is', 'a', 'the', 'an', 'on', 'in', 'to', 'for', 'of', 'and', 'or', 'are', 
    'was', 'were', 'do', 'does', 'did', 'how', 'what', 'why', 'where', 'when', 
    'who', 'which', 'about', 'this', 'that', 'with', 'you', 'your'
  ]);
  
  // Clean text and split into words
  const words = text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, ' ')
    .split(/\s+/)
    .map(w => w.trim())
    .filter(w => w.length > 2 && !stopWords.has(w));
    
  const stems = words.map(w => stemWord(w));
  return new Set(stems);
};

const isSimilarQuestion = (q1: string, q2: string): boolean => {
  const keywords1 = getKeywords(q1);
  const keywords2 = getKeywords(q2);
  
  if (keywords1.size === 0 || keywords2.size === 0) return false;
  
  let intersectionSize = 0;
  keywords1.forEach(word => {
    if (keywords2.has(word)) {
      intersectionSize++;
    }
  });
  
  const unionSize = keywords1.size + keywords2.size - intersectionSize;
  const similarity = intersectionSize / unionSize;
  
  return similarity >= 0.45;
};

const highlightReactChildren = (children: React.ReactNode, query: string): React.ReactNode => {
  if (!query.trim()) return children;
  
  return React.Children.map(children, child => {
    if (typeof child === 'string') {
      const parts = child.split(new RegExp(`(${escapeRegExp(query)})`, 'gi'));
      return parts.map((part, i) => 
        part.toLowerCase() === query.toLowerCase() 
          ? <mark key={i} className="text-highlight-yellow">{part}</mark> 
          : part
      );
    }
    if (React.isValidElement(child)) {
      const elementChild = child as React.ReactElement<any>;
      if (elementChild.props && elementChild.props.children) {
        return React.cloneElement(elementChild, {
          children: highlightReactChildren(elementChild.props.children, query)
        });
      }
    }
    return child;
  });
};

const App: React.FC = () => {
  // Load initial theme from localStorage (default to dark)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    return saved !== 'light';
  });

  // Load chat history from localStorage
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('chat_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved chat messages:', e);
      }
    }
    return [
      {
        id: 'init',
        role: 'assistant',
        content: 'Hello! I am Maity AI, your System Design and .NET Architecture AI. Ask me about caching strategies, handling bottlenecks, SOLID principles, or scaling databases.'
      }
    ];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1000);
  const [isInputHidden, setIsInputHidden] = useState(false);
  const lastScrollTop = useRef(0);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1000);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Layout States (Sidebar collapses on mobile by default)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return window.innerWidth < 1000;
  });
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [isQuestionJumperOpen, setIsQuestionJumperOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [currentMatchIndex, setCurrentMatchIndex] = useState(-1);
  const [matchingIds, setMatchingIds] = useState<string[]>([]);
  
  // Question Jumper States (List of all user questions)
  const [questionIds, setQuestionIds] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);

  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Apply theme class to document body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Sync messages to localStorage
  useEffect(() => {
    localStorage.setItem('chat_messages', JSON.stringify(messages));
  }, [messages]);

  // Handle scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll logic for new messages
  useEffect(() => {
    if (messages.length <= 1) return;

    const lastMsg = messages[messages.length - 1];
    // Don't auto scroll if it is a repeat prompt card
    if (lastMsg.id.startsWith('repeat-prompt')) {
      scrollToBottom();
      return;
    }

    if (lastMsg.role === 'assistant' && lastMsg.id !== 'init') {
      // Scroll to start of assistant message so user can read from beginning
      setTimeout(() => {
        const element = document.getElementById(`msg-${lastMsg.id}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    } else {
      scrollToBottom();
    }
  }, [messages]);

  // Scroll to bottom on loading (user sending message)
  useEffect(() => {
    if (isLoading) {
      scrollToBottom();
    }
  }, [isLoading]);

  // Check scroll position to show/hide bottom arrow button and show/hide input bar on mobile
  const handleScroll = () => {
    const container = chatMessagesRef.current;
    if (!container) return;
    
    const isScrolledUp = container.scrollHeight - container.scrollTop - container.clientHeight > 300;
    setShowScrollBottom(isScrolledUp);

    if (isMobile) {
      const currentScrollTop = container.scrollTop;
      const isAtBottom = container.scrollHeight - currentScrollTop - container.clientHeight < 30;
      
      if (isAtBottom) {
        setIsInputHidden(false);
      } else if (currentScrollTop < lastScrollTop.current) {
        // Scrolling up (towards older messages), hide input bar
        setIsInputHidden(true);
      } else if (currentScrollTop > lastScrollTop.current) {
        // Scrolling down (towards newer messages/bottom), show input bar
        setIsInputHidden(false);
      }
      lastScrollTop.current = currentScrollTop;
    } else {
      setIsInputHidden(false);
    }
  };

  const handleScrollToBottom = () => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTo({
        top: chatMessagesRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  // Search Match Engine
  useEffect(() => {
    if (!searchQuery.trim()) {
      setMatchingIds([]);
      setCurrentMatchIndex(-1);
    } else {
      const query = searchQuery.toLowerCase();
      const matched = messages
        .filter(msg => !msg.content.startsWith('__REPEAT_PROMPT__:') && msg.content.toLowerCase().includes(query))
        .map(msg => msg.id);
      setMatchingIds(matched);
      setCurrentMatchIndex(matched.length > 0 ? matched.length - 1 : -1);
    }
  }, [searchQuery, messages]);

  // Sync Question Jumper IDs (List of all user questions)
  useEffect(() => {
    const userQIds = messages
      .filter(msg => msg.role === 'user')
      .map(msg => msg.id);
    setQuestionIds(userQIds);
    if (userQIds.length > 0 && currentQuestionIndex === -1) {
      setCurrentQuestionIndex(userQIds.length - 1);
    }
  }, [messages]);

  const scrollToMessageId = (id: string, block: ScrollIntoViewOptions['block'] = 'center') => {
    const element = document.getElementById(`msg-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block });
      element.classList.add('nav-highlight');
      setTimeout(() => {
        element.classList.remove('nav-highlight');
      }, 2000); // Highlight glow on bubble card for 2 seconds
    }
  };

  const handleNavigateUp = () => {
    if (matchingIds.length === 0) return;
    let newIndex = currentMatchIndex - 1;
    if (newIndex < 0) {
      newIndex = matchingIds.length - 1;
    }
    setCurrentMatchIndex(newIndex);
    scrollToMessageId(matchingIds[newIndex]);
  };

  const handleNavigateDown = () => {
    if (matchingIds.length === 0) return;
    let newIndex = currentMatchIndex + 1;
    if (newIndex >= matchingIds.length) {
      newIndex = 0;
    }
    setCurrentMatchIndex(newIndex);
    scrollToMessageId(matchingIds[newIndex]);
  };

  const handleQuestionJumpUp = () => {
    if (questionIds.length === 0) return;
    let newIndex = currentQuestionIndex - 1;
    if (newIndex < 0) {
      newIndex = questionIds.length - 1;
    }
    setCurrentQuestionIndex(newIndex);
    scrollToMessageId(questionIds[newIndex]);
  };

  const handleQuestionJumpDown = () => {
    if (questionIds.length === 0) return;
    let newIndex = currentQuestionIndex + 1;
    if (newIndex >= questionIds.length) {
      newIndex = 0;
    }
    setCurrentQuestionIndex(newIndex);
    scrollToMessageId(questionIds[newIndex]);
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery(''); // Clear text so highlights disappear
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const queryText = input.trim();

    // Lenient check for duplicate questions in history
    const previousUserMessages = messages.filter(msg => msg.role === 'user');
    const duplicate = previousUserMessages.find(msg => isSimilarQuestion(msg.content, queryText));

    if (duplicate) {
      // Inject duplicate question warning card in chat area
      const promptId = `repeat-prompt-${Date.now()}`;
      const repeatPromptMsg: Message = {
        id: promptId,
        role: 'assistant',
        content: `__REPEAT_PROMPT__:${duplicate.id}:${queryText}`
      };
      setMessages(prev => [...prev, repeatPromptMsg]);
      setInput('');
      return;
    }

    await executeSendMessage(queryText);
  };

  const executeSendMessage = async (queryText: string) => {
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: queryText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Requested-With': 'MaityAI-Client'
        },
        body: JSON.stringify({
          message: userMsg.content,
          history: messages.slice(1).filter(msg => !msg.id.startsWith('repeat-prompt'))
        })
      });

      if (!res.ok) {
        if (res.status === 429) {
          throw new Error('Too many requests. Please wait a minute and try again.');
        }
        throw new Error(`API Error: ${res.statusText}`);
      }

      const data = await res.json();
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: data.response };
      setMessages(prev => [...prev, aiMsg]);

    } catch (error: any) {
      console.error('Failed to reach the AI backend:', error);
      const errorMessage = error.message.includes('Too many requests')
        ? error.message
        : `Sorry, I'm having trouble connecting to the service right now. Please check your internet connection or try again in a moment.`;
      
      const errorMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: errorMessage
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToPrevious = (originalId: string, promptId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== promptId));
    // Scroll to the start of the original question at the top of the viewport
    scrollToMessageId(originalId, 'start');
  };

  const handleAskAgain = async (originalText: string, promptId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== promptId));
    await executeSendMessage(originalText);
  };

  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear your chat history?")) {
      setMessages([
        {
          id: 'init',
          role: 'assistant',
          content: 'Hello! I am Maity AI, your System Design and .NET Architecture AI. Ask me about caching strategies, handling bottlenecks, SOLID principles, or scaling databases.'
        }
      ]);
    }
  };

  const hasMessages = messages.length > 1;

  const searchWidget = hasMessages && (
    <div className={`search-panel ${isSearchOpen ? 'expanded' : 'collapsed'}`}>
      {isSearchOpen ? (
        <>
          <div className="jumper-header">
            <span>Search Chat</span>
            <button onClick={handleCloseSearch} className="jumper-close-btn">×</button>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search text..."
            className="nav-search-input"
            autoFocus
          />
          {matchingIds.length > 0 && (
            <div className="jumper-controls">
              <button 
                onClick={handleNavigateUp} 
                className="jumper-arrow-btn"
                title="Previous Match"
              >
                ▲
              </button>
              <span className="jumper-count">
                {currentMatchIndex + 1} / {matchingIds.length}
              </span>
              <button 
                onClick={handleNavigateDown} 
                className="jumper-arrow-btn"
                title="Next Match"
              >
                ▼
              </button>
            </div>
          )}
        </>
      ) : (
        <button 
          onClick={() => {
            setIsSearchOpen(true);
            setIsQuestionJumperOpen(false);
          }}
          className="jumper-toggle-btn"
          title="Search Chat"
        >
          <Search size={18} />
        </button>
      )}
    </div>
  );

  const questionJumperWidget = hasMessages && (
    <div className={`question-jumper-panel ${isQuestionJumperOpen ? 'expanded' : 'collapsed'}`}>
      {isQuestionJumperOpen ? (
        <>
          <div className="jumper-header">
            <span>Question Jumper</span>
            <button onClick={() => setIsQuestionJumperOpen(false)} className="jumper-close-btn">×</button>
          </div>
          <div className="jumper-controls">
            <button 
              onClick={handleQuestionJumpUp} 
              disabled={questionIds.length === 0}
              className="jumper-arrow-btn"
              title="Previous Question"
            >
              ▲
            </button>
            <span className="jumper-count">
              {questionIds.length > 0 ? `${currentQuestionIndex + 1} / ${questionIds.length}` : '0 Q'}
            </span>
            <button 
              onClick={handleQuestionJumpDown} 
              disabled={questionIds.length === 0}
              className="jumper-arrow-btn"
              title="Next Question"
            >
              ▼
            </button>
          </div>
        </>
      ) : (
        <button 
          onClick={() => {
            setIsQuestionJumperOpen(true);
            setIsSearchOpen(false);
          }}
          className="jumper-toggle-btn"
          title="Jump Previous Questions"
        >
          <History size={18} />
        </button>
      )}
    </div>
  );

  return (
    <div className="chat-layout">
      {/* Sidebar Backdrop (closes sidebar on mobile overlay clicking) */}
      {!isSidebarCollapsed && isMobile && (
        <div className="sidebar-backdrop" onClick={() => setIsSidebarCollapsed(true)} />
      )}

      {/* Sidebar */}
      <aside className={`chat-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-header-info">
            <img src="Logo.png" alt="Maity AI" className="sidebar-logo" />
            <h2>Maity AI</h2>
          </div>
          <button 
            className="sidebar-collapse-btn" 
            onClick={() => setIsSidebarCollapsed(true)}
            title="Collapse Sidebar"
          >
            <ChevronLeft size={18} />
          </button>
        </div>
        <div className="sidebar-topics">
          <p className="sidebar-label">Suggested Topics</p>
          <button className="topic-btn" onClick={() => setInput("How do I fix a read-heavy database bottleneck?")}>
            <Database size={16} /> Scaling Databases
          </button>
          <button className="topic-btn" onClick={() => setInput("Explain Dependency Inversion with C# code.")}>
            <Code2 size={16} /> .NET Architecture
          </button>
          <button className="topic-btn" onClick={() => setInput("When should I use a Message Queue vs an API Gateway?")}>
            <Zap size={16} /> Async Decoupling
          </button>
        </div>
        
        {/* Sidebar Footer for Theme & Clear Chat */}
        <div className="sidebar-footer">
          <button className="sidebar-footer-btn" onClick={() => setIsDarkMode(prev => !prev)}>
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button className="sidebar-footer-btn" onClick={handleClearChat} style={{ color: '#EF4444' }}>
            <Trash2 size={16} /> Clear Chat
          </button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="chat-main">
        {/* Sticky Chat Header */}
        <header className={`chat-header ${!isSidebarCollapsed ? 'hidden' : ''}`}>
          <button 
            className="sidebar-expand-btn" 
            onClick={() => setIsSidebarCollapsed(false)}
            title="Expand Sidebar"
          >
            <Menu size={20} />
          </button>
          <div className="chat-header-info">
            <img 
              src="Logo.png" 
              alt="Maity AI" 
              className="chat-header-logo" 
            />
            <span className="chat-header-title">Maity AI</span>
          </div>
        </header>
        
        {isMobile && hasMessages && (
          <div className={`chat-header-widgets ${!isSidebarCollapsed ? 'hidden' : ''}`}>
            {searchWidget}
            {questionJumperWidget}
          </div>
        )}
        
        <div 
          ref={chatMessagesRef}
          onScroll={handleScroll}
          className="chat-messages"
        >
          {messages.map(msg => {
            // Render Repeat Question Prompt Card
            if (msg.content.startsWith('__REPEAT_PROMPT__:')) {
              const parts = msg.content.split(':');
              const duplicateId = parts[1];
              const queryText = parts.slice(2).join(':');
              
              return (
                <div key={msg.id} className="message-wrapper assistant">
                  <div className="message-avatar" style={{ background: 'transparent', boxShadow: 'none' }}>
                    <img 
                      src="Logo.png" 
                      alt="Maity AI" 
                      style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '6px' }} 
                    />
                  </div>
                  <div className="message-content">
                    <div className="message-sender">Maity AI</div>
                    <div className="repeat-prompt-card">
                      <div className="repeat-prompt-title">
                        You asked this same question earlier. Would you like to view the previous answer or ask again?
                      </div>
                      <div className="repeat-prompt-actions">
                        <button 
                          className="repeat-btn primary"
                          onClick={() => handleGoToPrevious(duplicateId, msg.id)}
                        >
                          Go to Previous Answer
                        </button>
                        <button 
                          className="repeat-btn secondary"
                          onClick={() => handleAskAgain(queryText, msg.id)}
                        >
                          Ask AI Again
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            if (msg.id === 'init') {
              if (messages.length > 1) return null;
              return (
                <div key={msg.id} className="hero-container">
                  <img src="Logo.png" alt="Maity AI" className="hero-logo" />
                  <h1 className="hero-title">Maity AI</h1>
                  <p className="hero-subtitle">{msg.content}</p>
                </div>
              );
            }

            // Normal messages
            return (
              <div key={msg.id} id={`msg-${msg.id}`} className={`message-wrapper ${msg.role}`}>
                <div className="message-avatar" style={msg.role === 'assistant' ? { background: 'transparent', boxShadow: 'none' } : {}}>
                  {msg.role === 'assistant' ? (
                    <img 
                      src="Logo.png" 
                      alt="Maity AI" 
                      style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '6px' }} 
                    />
                  ) : (
                    <User size={24} />
                  )}
                </div>
                <div className="message-content">
                  <div className="message-sender">{msg.role === 'assistant' ? 'Maity AI' : 'You'}</div>
                  <div className="message-bubble">
                    {msg.role === 'assistant' ? (
                      <div className="markdown-content">
                        <ReactMarkdown components={{
                          p: ({ children }) => <p>{highlightReactChildren(children, searchQuery)}</p>,
                          li: ({ children }) => <li>{highlightReactChildren(children, searchQuery)}</li>,
                          h1: ({ children }) => <h1>{highlightReactChildren(children, searchQuery)}</h1>,
                          h2: ({ children }) => <h2>{highlightReactChildren(children, searchQuery)}</h2>,
                          h3: ({ children }) => <h3>{highlightReactChildren(children, searchQuery)}</h3>,
                          code: ({ children }) => <code>{highlightReactChildren(children, searchQuery)}</code>
                        }}>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <div style={{ whiteSpace: 'pre-wrap' }}>
                        {highlightReactChildren(msg.content, searchQuery)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {isLoading && (
            <div className="message-wrapper assistant">
              <div className="message-avatar" style={{ background: 'transparent', boxShadow: 'none' }}>
                <img 
                  src="Logo.png" 
                  alt="Maity AI" 
                  style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '6px' }} 
                />
              </div>
              <div className="message-content">
                <div className="message-sender">Maity AI</div>
                <div className="message-bubble loading-bubble">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Floating Scroll to Bottom Button (Bottom Center) - Only appears when chat has messages */}
        {hasMessages && showScrollBottom && (
          <button className="scroll-bottom-btn" onClick={handleScrollToBottom} aria-label="Scroll to bottom">
            <ArrowDown size={20} />
          </button>
        )}

        {!isMobile && (
          <div className="floating-widgets-container">
            {questionJumperWidget}
            {searchWidget}
          </div>
        )}

        <div className={`chat-input-container ${isInputHidden ? 'hide-input' : ''}`}>
          <form onSubmit={handleSubmit} className="chat-form">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder={isMobile ? "Ask a question..." : "Ask a question about System Design or .NET..."}
              rows={1}
            />
            <button type="submit" disabled={!input.trim() || isLoading} className="send-btn">
              <Send size={20} />
            </button>
          </form>
          <div className="input-footer">
            Press Enter to send, Shift + Enter for new line. AI can make mistakes. Check important info.
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
