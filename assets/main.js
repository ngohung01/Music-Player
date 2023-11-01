const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "My-app_PLAYER";
const player = $(".player");
const cd = $(".cd");
const nameSong = $(".dashboard h2");
const cdSong = $(".cd .cd-thumb");
const audio = $("#audio");
const btnPlay = $(".btn.btn-toggle-play");
const range = $("input.progress");
const btnNext = $(".btn.btn-next");
const btnPrev = $(".btn.btn-prev");
const btnRepeat = $(".btn.btn-repeat");
const btnRandom = $(".btn.btn-random");
const btnVolume = $(".btn.btn-volume .volume");
const rangeVolume = $("input.volume");
const randomSongsIndex = [];
const playlist = $(".playlist");
console.log(btnVolume);
const app = {
  currentIndexSong: 0,
  test: 0,
  isPlaying: false,
  isRange: false,
  isRandoming: false,
  isRepeating: false,
  isVolumeUp: true,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  songs: [
    {
      img: "./assets/img/anhchangthe.jpg",
      music: "./assets/music/anhchangthe.mp3",
      name: "Anh Chẳng Thể",
      singer: "Phạm Kỳ",
    },
    {
      img: "./assets/img/anhdatuboroiday.jpg",
      music: "./assets/music/anhdatuboroiday.mp3",
      name: "Anh Đã Từ Bỏ Rồi Đấy",
      singer: "Nguyenn, Aric",
    },
    {
      img: "./assets/img/chuyendoita.jpg",
      music: "./assets/music/chuyendoita.mp3",
      name: "Chuyện Đôi Ta",
      singer: "Emcee L (Da LAB), Muộii",
    },
    {
      img: "./assets/img/giaidieumientay.jpg",
      music: "./assets/music/giaidieumientay.mp3",
      name: "Giai Điệu Miền Tây",
      singer: "Jack-J97",
    },
    {
      img: "./assets/img/nhuanhdathayem.jpg",
      music: "./assets/music/nhuanhdathayem.mp3",
      name: "Như Anh Đã Thấy Em",
      singer: "PhucXP, Freak D",
    },
    {
      img: "./assets/img/roitasengamphaohoacungnhau.jpg",
      music: "./assets/music/roitasengamphaohoacungnhau.mp3",
      name: "Rồi Ta Sẽ Ngắm Pháo Hoa Cùng Nhau",
      singer: "O.lew",
    },
    {
      img: "./assets/img/tethatanhnhoem.jpg",
      music: "./assets/music/tethatanhnhoem.mp3",
      name: "Tệ Thật, Anh Nhớ Em",
      singer: "Thanh Hưng",
    },
    {
      img: "./assets/img/vebenanh.jpg",
      music: "./assets/music/vebenanh.mp3",
      name: "Về Bên Anh",
      singer: "Jack - J97",
    },
    {
      img: "./assets/img/westsidesquad.png",
      music: "./assets/music/westsidesquad.mp3",
      name: "Westside Squad",
      singer: "Jombie , Dế Choắt (DC), Endless",
    },
    {
      img: "./assets/img/giupanhtraloinhungcauhoi.jpg",
      music: "./assets/music/giupanhtraloinhungcauhoi.mp3",
      name: "Giúp anh trả lời những câu hỏi",
      singer: "Anh tú",
    },
  ],
  render: function () {
    const listSong = $(".playlist");
    let html = this.songs
      .map((song, index) => {
        return `
            <div class="song song${index} ${
          index === this.currentIndexSong ? "active" : ""
        }" data-index-song=${index} >
                <div class="thumb" style="background-image: url('${song.img}')">
                </div>
                <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
          `;
      })
      .join("");
    listSong.innerHTML = html;
  },
  defindProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndexSong];
      },
    });
  },
  handleEvents: function () {
    const widthCD = cd.offsetWidth;
    //Xử lý CD quay - dừng
    const cdAnimate = cdSong.animate(
      [
        {
          transform: "rotate(360deg)",
        },
      ],
      {
        duration: 10000,
        iterations: Infinity,
      }
    );
    cdAnimate.pause();
    //Xử lý phóng to thu nhỏ CD
    document.onscroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCDWidth = widthCD - scrollTop;
      cd.style.width = newCDWidth < 0 ? 0 : `${newCDWidth}px`;
      cd.style.opacity = newCDWidth / widthCD;
    };
    //Xử lý khi click vào play
    btnPlay.onclick = () => {
      if (this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };
    //Khi nhạc chạy
    audio.onplay = () => {
      player.classList.add("playing");
      this.isPlaying = true;
      cdAnimate.play();
    };
    //Khi nhạc dừng
    audio.onpause = () => {
      player.classList.remove("playing");
      this.isPlaying = false;
      cdAnimate.pause();
    };
    //Khi tiến độ bài hát thay đổi
    audio.ontimeupdate = () => {
      if (audio.duration && !this.isRange) {
        const percent = Math.floor((audio.currentTime / audio.duration) * 100);
        range.value = percent;
      }
    };
    //Khi thanh range thay đổi
    range.onchange = () => {
      audio.currentTime = (range.value * audio.duration) / 100;
    };
    //Khi thanh range được nhấn xuống
    range.onmousedown = () => {
      //Chuyển isRange = true để xác định thanh range đang được nhấn => nó sẽ ngăn chặn event ontimeUpdate
      this.isRange = true;
    };
    //Khi thanh range được thả
    range.onmouseup = () => {
      this.isRange = false;
    };

    //Khi click vào nút next
    btnNext.onclick = () => {
      //Kiểm tra xem nút random có được kích hoạt không
      if (this.isRandoming) {
        this.randomSong();
      } else this.nextSong();
      console.log(this.currentIndexSong);
      this.loadCurrentSong();
      audio.play();
      this.activeSong();
      this.scrollActiveSong();
    };

    //Khi click vào nút prev
    btnPrev.onclick = () => {
      if (this.isRandoming) {
        this.randomSong();
      } else this.prevSong();
      this.loadCurrentSong();
      audio.play();
      this.activeSong();
      this.scrollActiveSong();
    };

    //Khi hết bài
    audio.onended = () => {
      console.log(this.isRepeating);
      if (this.isRepeating) {
        audio.play();
      } else btnNext.click();
    };

    //Xử lý khi click vào nút random
    btnRandom.onclick = () => {
      btnRandom.classList.toggle("active");
      this.isRandoming = !this.isRandoming;
      this.setConfig("isRandoming", this.isRandoming);
    };

    //Xử lý khi click vào Repeat
    btnRepeat.onclick = () => {
      btnRepeat.classList.toggle("active");
      this.isRepeating = !this.isRepeating;
      this.setConfig("isRepeating", this.isRepeating);
    };

    //Xử lý khi click vào playlist
    playlist.onclick = (e) => {
      const optionSong = e.target.closest(".option");
      const choiceSong = e.target.closest(".song:not(.active)");
      if (!optionSong && choiceSong) {
        this.currentIndexSong = choiceSong.dataset.indexSong;
        this.loadCurrentSong();
        audio.play();
        this.activeSong();
        this.scrollActiveSong();
      }
      if (optionSong) {
        console.log(optionSong);
      }
    };

    //Xử lý khi click vào volume
    btnVolume.onclick = () => {
      this.isVolumeUp = !this.isVolumeUp;
      btnVolume.classList.toggle("up", this.isVolumeUp);
      if (!this.isVolumeUp) {
        audio.volume = 0;
      } else audio.volume = rangeVolume.value / 100;
      console.log(rangeVolume.value);
    };
    rangeVolume.onchange = () => {
      if (Number(rangeVolume.value) === 0) {
        this.isVolumeUp = false;
      } else this.isVolumeUp = true;
      audio.volume = rangeVolume.value / 100;
      btnVolume.classList.toggle("up", this.isVolumeUp);
    };
  },
  loadCurrentSong: function () {
    nameSong.textContent = this.currentSong.name;
    cdSong.style.backgroundImage = `url('${this.currentSong.img}')`;
    audio.src = this.currentSong.music;
    this.setConfig("currentIndexSong", this.currentIndexSong);
  },
  loadConfig: function () {
    this.isRandoming = this.config["isRandoming"];
    this.isRepeating = this.config["isRepeating"];
    if(Object.keys(this.config).length > 0)
      this.currentIndexSong = Number(this.config["currentIndexSong"]);
    btnRandom.classList.toggle("active", this.isRandoming);
    btnRepeat.classList.toggle("active", this.isRepeating);
    this.scrollActiveSong();
  },
  nextSong: function () {
    this.currentIndexSong++;
    if (this.currentIndexSong >= this.songs.length) {
      this.currentIndexSong = 0;
    }
  },
  prevSong: function () {
    this.currentIndexSong--;
    if (this.currentIndexSong < 0) {
      this.currentIndexSong = this.songs.length - 1;
    }
  },
  randomSong: function () {
    let currentRandomLength = randomSongsIndex.length + 1;
    if (randomSongsIndex.length == 0) {
      randomSongsIndex.push(this.currentIndexSong);
    }
    do {
      let check = true;
      const random = Math.floor(Math.random() * this.songs.length);
      randomSongsIndex.forEach((obj) => {
        if (obj == random) {
          check = false;
        }
      });
      if (check) {
        this.currentIndexSong = random;
        randomSongsIndex.push(random);
      }
    } while (randomSongsIndex.length < currentRandomLength);

    if (randomSongsIndex.length == this.songs.length) {
      randomSongsIndex.splice(0);
    }
  },
  activeSong: function () {
    const oldActiveSong = $(".song.active");
    oldActiveSong.classList.remove("active");
    const currentSonging = $(".song.song" + this.currentIndexSong);
    currentSonging.classList.add("active");
  },
  scrollActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }, 200);
  },
  start: function () {
    //Tải cấu hình vào ứng dụng
    this.loadConfig();
    //Định nghĩa cho các thuộc tính Object
    this.defindProperties();   
    //Lắng nghe // xử lý các sự kiện (DOM events)
    this.handleEvents();

    //Tải bài hát lên giao diện User Interface
    this.loadCurrentSong();
    //Render playlist
    this.render();
  },
};
console.log(app.currentIndexSong)

app.start();

