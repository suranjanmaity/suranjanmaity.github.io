let section_project = document.querySelector("#project");
let project = document.querySelector('.projects');
let project_item = document.querySelectorAll('.project_item');
// project_item.forEach(item=> {
//     item.classList.add('entry-animation');
//     item.style.display = 'none';
// });
project.style.display = 'none';


// Create the observer
const observer = new IntersectionObserver(entries => {
    entries.forEach((entry) => {
        const project_item = entry.target.querySelectorAll('.project_item');
        if (entry.isIntersecting) {
            
            project.style.display = 'flex';
            project_item.forEach(item=> {
                setTimeout(() => {
                item.classList.add('entry-animation');
                item.style.display = 'flex';
                },1000);
            });
            return;
        }
        
        project.style.display = 'none';
        project_item.forEach(item=> {
            item.classList.remove('entry-animation');
            item.style.display = 'none';
        });
    });
});
// Tell the observer which elements to track
observer.observe(section_project);