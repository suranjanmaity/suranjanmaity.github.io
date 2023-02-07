let section_project = document.querySelector("#project");
let project = document.querySelector('.projects');
let project_item = document.querySelectorAll('.project_item');
project.style.display = 'none';
// Create the observer
const observer = new IntersectionObserver(entries => {
    entries.forEach((entry) => {
        const project_item = entry.target.querySelectorAll('.project_item');
        // if observed element is visible
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
let project_heading = new Array();
for (let index = 0; index < project_item.length; index++) {
    project_heading[index] = project_item[index].children[0];
};
for (let index = 0; index < project_item.length; index++) {
    const element = project_item[index];
    element.addEventListener("mouseover", () => {
        element.children[1].style.display = "none";
        if(index==0){
            project_heading[0].style.color = "#FFBF00";
            project_heading[0].style.textShadow = "5px 5px 10px darkred";
        }
        if(index==1){
            project_heading[1].style.color = "white";
            project_heading[1].style.textShadow = "5px 5px 10px  #FF00FF ";
        }
        if(index==2){
            project_heading[2].style.color = "#FCEDDA";
            project_heading[2].style.textShadow = "5px 5px 10px #EE4E34";
        }
        if(index==3){
            project_heading[3].style.color = "lightgreen";
            project_heading[3].style.textShadow = "5px 5px 10px black";
        }
    });
    element.addEventListener("mouseout", () => {
        element.children[1].style.display = "flex";
        project_heading[0].style.color = "white";
        project_heading[1].style.color = "white";
        project_heading[2].style.color = "white";
        project_heading[3].style.color = "white";
        project_heading[0].style.textShadow = "none";
        project_heading[1].style.textShadow = "none";
        project_heading[2].style.textShadow = "none";
        project_heading[3].style.textShadow = "none";

    });
};
console.log(project_heading);