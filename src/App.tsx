import _ from "lodash";
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import gameApi from './api/gameApi';

interface Game {
  id: Number;
  homeTeam: string;
  awayTeam: string;
  homeGoals: Number;
  awayGoals: Number;
}

interface Score {
  id: Number;
  team: string;
  points: Number;
}

const columnsGames = [
  { field: 'homeTeam', headerName: 'HOME', width: 130 },
  { field: 'awayTeam', headerName: 'AWAY', width: 130 },
  { field: 'homeGoals', headerName: '', width: 130, editable: true},
  { field: 'awayGoals', headerName: '', width: 130, editable: true },
];

const columnsScores = [
  { field: 'team', headerName: 'TEAM', width: 260 },
  { field: 'points', headerName: 'POINTS', width: 130, editable: true },
];

function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [scores, setScores] = useState<Score[]>([]);
  
  const handleEditRowsModelChange = React.useCallback((model) => {
    // to do
  }, []);
  
  const calculateScores = (games: Game[]) => {
    let id:Number=1;
    let tmpScores: Score[] = [];
    for(const g of games){
      if(g.homeGoals > g.awayGoals)  {
        const scoreIndex = _.findIndex(tmpScores, (s:Score) => s.team === g.homeTeam)
        if(scoreIndex > -1) {tmpScores[scoreIndex].points = Number(tmpScores[scoreIndex].points) + 3;}
        else tmpScores = [...tmpScores, {id, team: g.homeTeam, points: 3}];;
        setScores(tmpScores);
      }      
      else if(g.homeGoals < g.awayGoals)  {
        const scoreIndex = _.findIndex(tmpScores, (s:Score) => s.team === g.awayTeam)
        if(scoreIndex > -1) {tmpScores[scoreIndex].points = Number(tmpScores[scoreIndex].points) + 3;}
        else tmpScores = [...tmpScores, {id, team: g.homeTeam, points: 3}];
        setScores(tmpScores);
      }      
      else if(g.homeGoals && g.awayGoals)  {
        const scoreIndex = _.findIndex(tmpScores, (s:Score) => s.team === g.homeTeam)
        const scoreIndex2 = _.findIndex(tmpScores, (s:Score) => s.team === g.awayTeam)
        if(scoreIndex > -1) tmpScores[scoreIndex].points = Number(tmpScores[scoreIndex].points) + 1;
        else tmpScores = [...tmpScores, {id, team: g.homeTeam, points: 1}];;
        if(scoreIndex2 > -1) tmpScores[scoreIndex2].points = Number(tmpScores[scoreIndex2].points) + 1;
        else tmpScores = [...tmpScores, {id, team: g.homeTeam, points: 1}];;
        setScores(tmpScores);
      }  
      id= Number(id) + 1;
    }
  }

  useEffect(() => {
    async function fetchGames() {
      const games = await gameApi.getMatches();
      setGames(games);
      calculateScores(games);
    }
    fetchGames();
  }, [])

  return (
    <div style={{ height: 400, width: '100%' }}>
      <h1>GAMES</h1>
      <DataGrid
        rows={games}
        columns={columnsGames} 
        onEditRowsModelChange={handleEditRowsModelChange}     />
        <h1>SCORES</h1>
    <DataGrid
      rows={scores}
      columns={columnsScores}      />
    </div>

  
  );
}

export default App;
