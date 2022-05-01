document.addEventListener("DOMContentLoaded", () => {
    const wordList = document.getElementsByClassName("wordList")[0];
    const previousDate = document.getElementsByClassName("previousDate")[0];
    const nextDate = document.getElementsByClassName("nextDate")[0];
    const dateInput = document.getElementsByClassName("dateInput")[0];
    const lodingUI = document.getElementsByClassName("lodingUI")[0];

    let date = [new Date().getFullYear(), (new Date().getMonth()+1).toString().padStart(2, "0"), new Date().getDate().toString().padStart(2, "0")];
    dateInput.value = `${date[0]}-${date[1]}-${date[2]}`;
    dateInput.min = `${date[0]}-${date[1]}-01`;
    dateInput.max = `${date[0]}-${date[1]}-${date[2]}`;

    function getList(date) {
        wordList.innerHTML = "";
        lodingUI.style.display = "block";

        fetch(`http://127.0.0.1:3000/api/main/${date[0]}/${date[1]}/${date[2]}`)
            .then((response) => response.json())
            .then((data) => {
                lodingUI.style.display = "none";

                data.forEach((item, count) => {
                    wordList.innerHTML += `<li><p class="ranking">${count + 1}</p> <span class="title">${item.title}</span><p class="traffic">${item.traffic.replace("K", "천") }</p></li>`;
                });
            })
            .catch(error => console.error(error))
    }

    getList(date);

    previousDate.addEventListener('click', () => {
        date[2]--;
        dateInput.value = `${date[0]}-${date[1]}-${date[2]}`
        getList(date);
    });

    nextDate.addEventListener('click', () => {
        if (date[2] < new Date().getDate()-1) {
            date[2]++;
            dateInput.value = `${date[0]}-${date[1]}-${date[2]}`
            getList(date);
        }
    });

    dateInput.addEventListener('change', (event) => {
        date = event.target.value.split('-');
        getList(date);
    })
});