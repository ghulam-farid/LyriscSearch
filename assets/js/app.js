const form = document.querySelector("#form");
const search = document.querySelector("#search");
const result = document.querySelector("#result");
const pagination = document.querySelector("#more");

const api_URL = `https://api.lyrics.ovh`;

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const search_term = search.value.trim();

  if (!search_term) {
    alert("Please type in a search term");
  } else {
    searchSongs(search_term);
  }
});

const searchSongs = async (term) => {
  const res = await fetch(`${api_URL}/suggest/${term}`);
  if (res.status === 200) {
    const data = await res.json();
    // console.log(data);
    showData(data);
  } else {
    alert("Something went wrong");
  }
};

const getLyrics = async (artist, song_title) => {
  const res = await fetch(`${api_URL}/v1/${artist}/${song_title}`);

  if (res.status === 200) {
    const data = await res.json();
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");
    result.innerHTML = `<h2><strong>${artist}</strong> - ${song_title}</h2><span>${lyrics}</span>`;
    pagination.innerHTML = "";
  } else {
    alert(res.statusText);
  }
};

const showData = (data) => {
  result.innerHTML = `
      <ul class="songs">
         ${data.data
           .map(
             (song) => `<li>
            <span><strong>${song.artist.name}</strong> - ${song.title}</span>
            <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
         </li>`
           )
           .join("")}
      </ul>
   `;

  if (data.prev || data.next) {
    pagination.innerHTML = `
         ${
           data.prev
             ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev</button>`
             : ""
         }
         ${
           data.next
             ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>`
             : ""
         }
      `;
  } else {
    pagination.innerHTML = "";
  }
};

const getMoreSongs = async (url) => {
  const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);

  if (res.status === 200) {
    const data = await res.json();
    showData(data);
  } else {
    alert("Something went wrong");
  }
};

result.addEventListener("click", (e) => {
  const clicked_el = e.target;

  if (clicked_el.tagName === "BUTTON") {
    const artist = clicked_el.getAttribute("data-artist");
    const song_title = clicked_el.getAttribute("data-songtitle");
      console.log(artist, song_title);
    getLyrics(artist, song_title);
  }
});
