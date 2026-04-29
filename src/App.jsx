import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Server, Share2, AlertTriangle, RefreshCw, Plus, WifiOff, Wifi } from 'lucide-react';

const App = () => {
  const [nodes, setNodes] = useState([
    { id: 1, name: 'Node A (Tchad)', data: [], status: 'online' },
    { id: 2, name: 'Node B (France)', data: [], status: 'online' },
    { id: 3, name: 'Node C (Canada)', data: [], status: 'online' },
  ]);

  const [isPartitioned, setIsPartitioned] = useState(false);
  const [newData, setNewData] = useState('');
  const [logs, setLogs] = useState([]);

  const addLog = (msg) => {
    setLogs(prev => [{ time: new Date().toLocaleTimeString(), msg }, ...prev.slice(0, 4)]);
  };

  const handleWrite = () => {
    if (!newData.trim()) return;
    const entry = { id: Math.random(), value: newData, timestamp: new Date().getTime() };
    
    setNodes(prevNodes => prevNodes.map(node => {
      if (isPartitioned) {
        if (node.id === 1) {
          addLog(`📝 كتابة محليّة في العقدة A: ${newData}`);
          return { ...node, data: [...node.data, entry] };
        }
        return node;
      } else {
        addLog(`🚀 تكرار البيانات (Replication): ${newData}`);
        return { ...node, data: [...node.data, entry] };
      }
    }));
    setNewData('');
  };

  const syncNodes = useCallback(() => {
    if (isPartitioned) return;

    setNodes(prevNodes => {
      const allData = [];
      const seenIds = new Set();
      prevNodes.forEach(node => {
        node.data.forEach(item => {
          if (!seenIds.has(item.id)) {
            allData.push(item);
            seenIds.add(item.id);
          }
        });
      });

      const sortedData = [...allData].sort((a, b) => a.timestamp - b.timestamp);
      const needsSync = prevNodes.some(n => n.data.length !== sortedData.length);
      
      if (needsSync) {
        addLog("🔄 جاري دمج البيانات المتضاربة (Healing)...");
        return prevNodes.map(node => ({ ...node, data: sortedData }));
      }
      return prevNodes;
    });
  }, [isPartitioned]);

  useEffect(() => {
    const timer = setTimeout(syncNodes, 800);
    return () => clearTimeout(timer);
  }, [nodes, syncNodes]);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 font-sans" dir="rtl">
      <header className="max-w-6xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-black flex items-center gap-3 bg-gradient-to-l from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            <Database size={40} className="text-blue-500" /> محاكي الأنظمة الموزعة
          </h1>
          <p className="text-slate-400 mt-2">شرح حي لنظرية CAP والتزامن النهائي</p>
        </motion.div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsPartitioned(!isPartitioned)}
          className={`px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-2xl transition-colors ${isPartitioned ? 'bg-red-600 shadow-red-900/20' : 'bg-emerald-600 shadow-emerald-900/20'}`}
        >
          {isPartitioned ? <><WifiOff /> كسر اتصال الشبكة</> : <><Wifi /> الشبكة متصلة</>}
        </motion.button>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">إدخال البيانات</h2>
            <div className="flex gap-2">
              <input 
                type="text" value={newData}
                onChange={(e) => setNewData(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleWrite()}
                placeholder="أدخل قيمة..."
                className="flex-1 bg-black border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              <button onClick={handleWrite} className="bg-blue-600 p-3 rounded-xl hover:bg-blue-500 transition-colors">
                <Plus />
              </button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl h-64 overflow-hidden">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">سجل العمليات</h2>
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {logs.map((log, i) => (
                  <motion.div 
                    key={log.time + i}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-xs font-mono text-slate-400 border-r-2 border-blue-500 pr-3"
                  >
                    <span className="text-blue-500">{log.time}</span> {log.msg}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {nodes.map(node => (
            <motion.div 
              key={node.id}
              layout
              className={`relative z-10 bg-slate-900 border-2 p-6 rounded-3xl transition-colors duration-500 ${isPartitioned && node.id !== 1 ? 'border-red-900/50 opacity-60' : 'border-slate-800'}`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-2xl ${node.id === 1 ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800'}`}>
                  <Server size={28} />
                </div>
                {isPartitioned && node.id !== 1 && (
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity }}>
                    <AlertTriangle className="text-red-500" />
                  </motion.div>
                )}
              </div>
              <h3 className="font-bold text-lg">{node.name}</h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-tighter mb-4">{node.id === 1 ? 'Primary Node' : 'Replica'}</p>
              <div className="bg-black/50 rounded-2xl p-4 h-56 overflow-y-auto border border-slate-800">
                <AnimatePresence>
                  {node.data.map((item) => (
                    <motion.div 
                      key={item.id}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-slate-800/50 p-3 rounded-xl mb-2 text-sm flex justify-between border border-white/5"
                    >
                      <span>{item.value}</span>
                      <span className="text-[9px] opacity-40">{new Date(item.timestamp).getMilliseconds()}ms</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;
