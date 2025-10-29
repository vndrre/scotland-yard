// ...existing code...
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import scotlandyardLogo from '../assets/scotlandyard.webp';
import towerBridge from '../assets/Tower_Bridge_at_Dawn.jpg';

const Lobby = () => {
  const navigate = useNavigate();
  const currentUsername = localStorage.getItem('username') || 'You';
  const currentUserId = localStorage.getItem('userId') || 'you-id';

  const sampleLobbies = [
    {
      id: 'lobby-1',
      name: 'Central Station',
      maxPlayers: 6,
      isPrivate: false,
      hostId: 'u1',
      players: [
        { id: 'u1', username: 'Alice', isReady: false, you: false, isMrX: false },
        { id: currentUserId, username: currentUsername, isReady: false, you: true, isMrX: false }
      ]
    },
    {
      id: 'lobby-2',
      name: 'Riverside Chase',
      maxPlayers: 8,
      isPrivate: true,
      hostId: 'u3',
      players: [
        { id: 'u3', username: 'Marcus', isReady: true, you: false, isMrX: true },
        { id: 'u4', username: 'Beth', isReady: false, you: false, isMrX: false }
      ]
    }
  ];

  const [lobbies, setLobbies] = useState(sampleLobbies);
  const [selected, setSelected] = useState(lobbies[0].id);
  const [lobbyDetails, setLobbyDetails] = useState(() => lobbies[0]);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', maxPlayers: 6, isPrivate: false, password: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const found = lobbies.find((l) => l.id === selected) || null;
    setLobbyDetails(found);
  }, [selected, lobbies]);

  const pickLobby = (id) => {
    setSelected(id);
    setMessage('');
  };

  const handleCreateChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCreateForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const createLobby = (e) => {
    e?.preventDefault();
    setCreating(true);
    setMessage('');
    const id = `lobby-${Date.now()}`;
    const newLobby = {
      id,
      name: createForm.name || `Lobby ${lobbies.length + 1}`,
      maxPlayers: Number(createForm.maxPlayers) || 6,
      isPrivate: !!createForm.isPrivate,
      hostId: currentUserId,
      players: [{ id: currentUserId, username: currentUsername, isReady: false, you: true, isMrX: false }]
    };
    setTimeout(() => {
      setLobbies((s) => [newLobby, ...s]);
      setSelected(id);
      setCreateForm({ name: '', maxPlayers: 6, isPrivate: false, password: '' });
      setCreating(false);
      setMessage('Lobby created locally (visual only).');
    }, 350);
  };

  const joinLobby = (id) => {
    setMessage('');
    setLobbies((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l;
        const exists = l.players.some((p) => p.id === currentUserId);
        if (exists) return l;
        if (l.players.length >= l.maxPlayers) {
          setMessage('Lobby is full.');
          return l;
        }
        return { ...l, players: [...l.players, { id: currentUserId, username: currentUsername, isReady: false, you: true, isMrX: false }] };
      })
    );
    setSelected(id);
  };

  const leaveLobby = (id) => {
    setLobbies((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l;
        return { ...l, players: l.players.filter((p) => p.id !== currentUserId).map((p) => ({ ...p, you: false })) };
      })
    );
    setSelected(null);
    setMessage('Left the lobby (visual only).');
  };

  const toggleReady = (lobbyId) => {
    setLobbies((prev) =>
      prev.map((l) => {
        if (l.id !== lobbyId) return l;
        return {
          ...l,
          players: l.players.map((p) => (p.id === currentUserId ? { ...p, isReady: !p.isReady } : p))
        };
      })
    );
  };

  const assignMrX = (lobbyId, playerId) => {
    setLobbies((prev) =>
      prev.map((l) => {
        if (l.id !== lobbyId) return l;
        return {
          ...l,
          players: l.players.map((p) => ({ ...p, isMrX: p.id === playerId }))
        };
      })
    );
  };

  const startGame = (lobbyId) => {
    setMessage('Starting game (visual only) — navigating to /game/:id');
    navigate(`/game/${lobbyId}`);
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: `url(${towerBridge})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-black/70"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-blue-900/40 to-slate-900/60"></div>

      <div className="w-full max-w-6xl relative z-10 grid grid-cols-12 gap-6">
        <div className="col-span-4 rounded-xl border bg-slate-900/80 backdrop-blur-xl border-slate-700/50 p-5">
          <div className="flex items-center gap-3 mb-4">
            <img src={scotlandyardLogo} alt="logo" className="h-12 w-auto" />
            <div>
              <h2 className="text-lg font-semibold text-white">Game Lobby</h2>
              <div className="text-xs text-slate-400">Create or join lobbies for Scotland Yard — Mr. X</div>
            </div>
          </div>

          <div className="mb-4">
            <div className="text-xs text-slate-300 mb-2">Available Lobbies</div>
            <div className="space-y-3">
              {lobbies.length === 0 && <div className="text-sm text-slate-400">No lobbies — create one.</div>}
              {lobbies.map((l) => (
                <div
                  key={l.id}
                  onClick={() => pickLobby(l.id)}
                  className={`p-3 rounded-md border cursor-pointer ${selected === l.id ? 'border-blue-500 bg-slate-800/60' : 'border-slate-700 bg-slate-900/40'} flex items-center justify-between`}
                >
                  <div>
                    <div className="font-medium text-white">{l.name}</div>
                    <div className="text-xs text-slate-400">{l.players?.length || 0}/{l.maxPlayers} players {l.isPrivate ? '· Private' : '· Public'}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={(e) => { e.stopPropagation(); pickLobby(l.id); }} className="text-xs px-2 py-1 rounded bg-slate-700/40 text-slate-200">View</button>
                    <button
                      onClick={(e) => { e.stopPropagation(); joinLobby(l.id); }}
                      disabled={l.players?.some((p) => p.id === currentUserId) || l.players.length >= l.maxPlayers}
                      className="text-xs px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                    >
                      {l.players?.some((p) => p.id === currentUserId) ? 'Joined' : 'Join'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <div className="text-xs text-slate-300 mb-2">Create Lobby</div>
            <form onSubmit={createLobby} className="space-y-2">
              <input
                name="name"
                value={createForm.name}
                onChange={handleCreateChange}
                placeholder="Lobby name"
                className="w-full px-3 py-2 rounded border bg-slate-950/50 text-white text-sm border-slate-700"
              />
              <div className="flex gap-2">
                <input
                  name="maxPlayers"
                  type="number"
                  min={2}
                  max={12}
                  value={createForm.maxPlayers}
                  onChange={handleCreateChange}
                  className="w-24 px-3 py-2 rounded border bg-slate-950/50 text-white text-sm border-slate-700"
                />
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input type="checkbox" name="isPrivate" checked={createForm.isPrivate} onChange={handleCreateChange} />
                  Private
                </label>
              </div>
              {createForm.isPrivate && (
                <input
                  name="password"
                  type="password"
                  value={createForm.password}
                  onChange={handleCreateChange}
                  placeholder="Password (visual only)"
                  className="w-full px-3 py-2 rounded border bg-slate-950/50 text-white text-sm border-slate-700"
                />
              )}
              <div className="flex gap-2">
                <button type="submit" disabled={creating} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded px-4 py-2">
                  {creating ? 'Creating...' : 'Create Lobby'}
                </button>
                <button type="button" onClick={() => setCreateForm({ name: '', maxPlayers: 6, isPrivate: false, password: '' })} className="bg-slate-700 text-slate-200 rounded px-4 py-2">
                  Reset
                </button>
              </div>
            </form>
          </div>

          {message && <div className="mt-3 text-sm text-amber-300">{message}</div>}
        </div>

        <div className="col-span-8 rounded-xl border bg-slate-900/80 backdrop-blur-xl border-slate-700/50 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Lobby Details</h3>
              <div className="text-xs text-slate-400">Select a lobby to see players and controls</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => { setLobbies((s) => [...s]); setMessage('Refreshed (visual).'); }} className="text-sm px-3 py-2 rounded bg-slate-700 text-slate-200">Refresh</button>
              <button onClick={() => { localStorage.removeItem('token'); navigate('/'); }} className="text-sm px-3 py-2 rounded bg-red-700 text-white">Logout</button>
            </div>
          </div>

          {!lobbyDetails && <div className="text-sm text-slate-400">Select a lobby to view details</div>}

          {lobbyDetails && (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">{lobbyDetails.name}</h3>
                  <div className="text-xs text-slate-400">{lobbyDetails.players?.length || 0}/{lobbyDetails.maxPlayers} players</div>
                </div>
                <div className="text-xs text-slate-300">{lobbyDetails.isPrivate ? 'Private' : 'Public'}</div>
              </div>

              <div className="rounded-md border border-slate-700 bg-slate-900/40 p-3">
                <div className="flex flex-col gap-2">
                  {lobbyDetails.players.map((p) => (
                    <div key={p.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-sm text-white">{(p.username || 'U').charAt(0).toUpperCase()}</div>
                        <div className="text-sm">
                          <div className="font-medium text-white">{p.username}</div>
                          <div className="text-xs text-slate-400">{p.id === lobbyDetails.hostId ? 'Host' : p.isReady ? 'Ready' : 'Not Ready'}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {lobbyDetails.hostId === currentUserId && (
                          <button onClick={() => assignMrX(lobbyDetails.id, p.id)} className="text-xs px-2 py-1 rounded bg-amber-600 text-white">
                            {p.isMrX ? 'Mr. X' : 'Make Mr. X'}
                          </button>
                        )}
                        {p.id === currentUserId ? (
                          <button onClick={() => toggleReady(lobbyDetails.id)} className="text-xs px-2 py-1 rounded bg-blue-600 text-white">
                            {p.isReady ? 'Unready' : 'Ready'}
                          </button>
                        ) : (
                          <div className="text-xs px-2 py-1 rounded text-slate-400">—</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                {lobbyDetails.players.some((p) => p.id === currentUserId) ? (
                  <>
                    <button onClick={() => leaveLobby(lobbyDetails.id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded px-4 py-2">Leave</button>
                    {lobbyDetails.hostId === currentUserId ? (
                      <button onClick={() => startGame(lobbyDetails.id)} className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded px-4 py-2">Start Game</button>
                    ) : (
                      <div className="flex-1 text-right text-xs text-slate-400 self-center">Waiting for host to start</div>
                    )}
                  </>
                ) : (
                  <button onClick={() => joinLobby(lobbyDetails.id)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2">Join Lobby</button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
      `}</style>
    </div>
  );
};

export default Lobby;
// ...existing code...