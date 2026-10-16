const menuButton = document.querySelector('.menu-button')
const navigation = document.querySelector('.header1')

menuButton.addEventListener ('click', function() {
    navigation.classList.toggle("open")

    const isOpen = navigation.classList.contains("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
})

const links = document.querySelector('.header1 a')

links.forEach((link) => {
    link.addEventListener("click", () => {
        navigation.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
    });
})