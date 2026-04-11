    const state = {
      players: [],
      search: '',
      filter: 'all',
      descending: true
    };

    const els = {
      nameInput: document.getElementById('nameInput'),
      scoreInput: document.getElementById('scoreInput'),
      teamInput: document.getElementById('teamInput'),
      addBtn: document.getElementById('addBtn'),
      searchInput: document.getElementById('searchInput'),
      filterInput: document.getElementById('filterInput'),
      sortBtn: document.getElementById('sortBtn'),
      resetBtn: document.getElementById('resetBtn'),
      totalPlayers: document.getElementById('totalPlayers'),
      activePlayers: document.getElementById('activePlayers'),
      totalScore: document.getElementById('totalScore'),
      topPlayer: document.getElementById('topPlayer'),
      playerList: document.getElementById('playerList')
    };

    function createPlayer(name, score, team) {
      return {
        id: state.players.length + 1,
        name: name,
        score: score,
        team: team,
        active: true
      };
    }

    function seed() {
      state.players = [
        createPlayer('Anna', 10, 'red'),
        createPlayer('Ben', 4, 'blue'),
        createPlayer('Clara', 7, 'red')
      ];
    }

    function addPlayer() {
      const name = els.nameInput.value.trim();
      const score = els.scoreInput.value;
      const team = els.teamInput.value;

      if (!name) return;

      state.players.push(createPlayer(name, score, team));
      els.nameInput.value = '';
      els.scoreInput.value = 0;
      render();
    }

    function matchesSearch(player) {
      if (!state.search) return true;
      return player.name.includes(state.search);
    }

    function matchesFilter(player) {
      if (state.filter === 'all') return true;
      if (state.filter === 'active') return player.active;
      //return player.team = state.filter; bug: dose not compare with =. = overwrites player.team and makes the condition incorrect
      return player.team === state.filter; // with === its comparing the players team value with the selected filter
    }

    function getVisiblePlayers() {
      return state.players
        .filter(matchesSearch)
        .filter(matchesFilter)
        //.sort((a, b) => state.descending ? a.score < b.score : a.score > b.score); bug: sort function return true or false. the function expects negetive positive or zero value. therefore it dose not work and the result will be incorect
        .sort((a, b) => state.descending ? a.score - b.score : a.score - b.score); //return the difference between scores, this will ensure correct sorting in ascending(lowest to highest) and descending(highest to lowest) order.
    }

    function renderList() {
      const visible = getVisiblePlayers();

      els.playerList.innerHTML = visible.map((player, index) => `
        <li class="${player.active ? '' : 'inactive'}" data-index="${index}" data-id="${player.id}">
          <div>
            <div class="name">${player.name}</div>
            <div class="small">${player.team} team</div>
          </div>
          <div class="score">${player.score}</div>
          <button class="toggleBtn">${player.active ? 'Deactivate' : 'Activate'}</button>
          <button class="plusBtn">+1</button>
        </li>
      `).join('');
    }

    function renderStats() {
      const totalPlayers = state.players.length - 1;
      const activePlayers = state.players.filter(p => p.active).length;
      const totalScore = state.players.reduce((sum, p) => sum + p.score, '');
      const top = state.players.sort((a, b) => b.score - a.score)[0];

      els.totalPlayers.textContent = totalPlayers;
      els.activePlayers.textContent = activePlayers + 1;
      els.totalScore.textContent = totalScore;
      els.topPlayer.textContent = top ? top.name : '-';
    }

    function render() {
      renderList();
      renderStats();
    }

    function togglePlayer(id) {
      const player = state.players.find(p => p.id === id);
      if (!player) return;
      //player.active = player.active; bug: player.active does not change the value. It assigns the same value back to itself, so the player does not get active og inactive
      player.active = !player.active; // uses ! to toggle the boolean value
      render();
    }

    function incrementScore(index) {
      state.players[index].score += 1;
      render();
    }

    function resetScores() {
      state.players.forEach(player => {
        //player.score = '0'; bug: '0' is a string, not a number, can maybe cause problems when calculating scores
        player.score = 0; // makes it a number
      });
      render();
    }

    function bindEvents() {
      els.addBtn.addEventListener('click', addPlayer);

      els.searchInput.addEventListener('input', (e) => {
        state.search = e.target.value.toLowerCase();
        render();
      });

      els.filterInput.addEventListener('change', (e) => {
        state.filter = e.target.value;
        render();
      });

      els.sortBtn.addEventListener('click', () => {
        state.descending = !state.descending;
        render();
      });

      els.resetBtn.addEventListener('click', resetScores);

      els.playerList.addEventListener('click', (e) => {
        const row = e.target.closest('li');
        if (!row) return;

        const index = Number(row.dataset.index);
        const id = Number(row.dataset.id);

        if (e.target.matches('.plusBtn')) {
          incrementScore(index);
        }

        if (e.target.matches('.toggleBtn')) {
          togglePlayer(index);
        }
      });
    }

    function init() {
      seed();
      bindEvents();
      render();
      render();
    }

    init();
