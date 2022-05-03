document.addEventListener("DOMContentLoaded", () => {
    const wordList = document.getElementsByClassName("wordList")[0];
    const previousDate = document.getElementsByClassName("previousDate")[0];
    const nextDate = document.getElementsByClassName("nextDate")[0];
    const dateInput = document.getElementsByClassName("dateInput")[0];
    const lodingUI = document.getElementsByClassName("lodingUI")[0];
    const today = document.getElementsByClassName("today")[0];

    let date, yr, mh, dy;

    function now() {
        return new Date();
    }

    function setDate(value) {
        date = value;
        yr = date.getFullYear();
        mh = date.getMonth() + 1;
        dy = date.getDate();
    }

    function Zfill(value) {
        return value.toString().padStart(2, "0");
    }

    function getList() {
        wordList.innerHTML = "";
        lodingUI.style.display = "block";

        if (new Date(new Date(date).setDate(date.getDate() - 1)) > new Date(now().setDate(now().getDate() - 29))) {
            previousDate.className = "previousDate";
        } else {
            previousDate.className = "previousDate block";
        }

        if (new Date(new Date(date).setDate(date.getDate() + 1)) < now()) {
            nextDate.className = "nextDate";
        } else {
            nextDate.className = "nextDate block";
        }
        
        fetch(`http://180.67.212.78:3050/api/main/${yr}/${mh}/${dy}`)
            .then((response) => response.json())
            .then((data) => {
                lodingUI.style.display = "none";
                wordList.innerHTML = "";
                data.forEach((item, count) => {
                    wordList.innerHTML += `<li><p class="ranking">${count + 1}</p> <span class="title">${item.title}</span><p class="traffic">${item.traffic.replace("K", "천") }</p></li>`;
                });
            })
            .catch(error => console.error(error))
    }

    setDate(new Date(now().setDate(now().getDate() - 28)));

    dateInput.min = `${yr}-${Zfill(mh)}-${Zfill(dy)}`;

    setDate(new Date(now().setDate(now().getDate())));

    dateInput.value = `${yr}-${Zfill(mh)}-${Zfill(dy)}`;
    dateInput.max = `${yr}-${Zfill(mh)}-${Zfill(dy)}`;
    getList();

    previousDate.addEventListener('click', () => {
        if (new Date(new Date(date).setDate(date.getDate() - 1)) > new Date(now().setDate(now().getDate() - 29))) {
            setDate(new Date(new Date(date).setDate(date.getDate() - 1)));
            dateInput.value = `${yr}-${Zfill(mh)}-${Zfill(dy)}`;
            getList();
        }
    });

    nextDate.addEventListener('click', () => {
        if (new Date(new Date(date).setDate(date.getDate() + 1)) < now()) {
            setDate(new Date(new Date(date).setDate(date.getDate() + 1)));
            dateInput.value = `${yr}-${Zfill(mh)}-${Zfill(dy)}`;
            getList();
        }
    });

    today.addEventListener('click', () => {
        setDate(now());
        dateInput.value = `${yr}-${Zfill(mh)}-${Zfill(dy)}`;
        getList();
    });

    dateInput.addEventListener('change', (event) => {
        [yr, mh, dy] = event.target.value.split('-');
        dy = parseInt(dy)
        setDate(new Date(event.target.value));
        getList();
    })
});