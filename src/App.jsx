import React, { useState, useEffect } from 'react';

// محاكي بسيط لقاعدة بيانات موزعة بـ 3 عقد
const nodesList = [
  { id: 1, name: 'Node: Chad (Primary)', region: 'Africa', status: 'online' },
  { id: 2, name: 'Node: France (Replica)', region: 'Europe', status: 'online' },
  { id: 3, name: 'Node: Canada (Replica)', region: 'Americas', status: 'online' }
];

function App() {
  const [data, setData] = useState([]);
  const [inputText, setInputText] = useState('');
  const [nodes, setNodes] = useState(nodesList);

  // وظيفة لإضافة بيانات ومحاكاة التوزيع (Replication)
  const handleAddData = () => {
    if (!inputText) return;
    
    const newData = {
      id: Date.now(),
      content: inputText,
      timestamp: new Date().toLocaleTimeString(),
      syncedNodes: nodes.filter(n => n.status === 'online').map(n => n.id)
    };

    setData([...data, newData]);
    setInputText('');
  };

  // محاكاة سقوط عقدة (Node Failure)
  const toggleNodeStatus = (id) => {
    setNodes(nodes.map(node => 
      node.id === id ? { ...node, status: node.status === 'online' ? 'offline' : 'online' } : node
    ));
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', direction: 'rtl' }}>
      <h1>محاكي قواعد البيانات الموزعة 🚀</h1>
      <p>مشروع بحثي: تأثير الأمن السيبراني على استقرار الأنظمة في تشاد</p>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {nodes.map(node => (
          <div key={node.id} style={{ 
            border: '1px solid #ccc', padding: '10px', borderRadius: '8px',
            backgroundColor: node.status === 'online' ? '#e6fffa' : '#fff5f5',
            flex: 1, textAlign: 'center'
          }}>
            <h3>{node.name}</h3>
            <p>المنطقة: {node.region}</p>
            <p>الحالة: <strong>{node.status === 'online' ? 'متصل' : 'منقطع'}</strong></p>
            <button onClick={() => toggleNodeStatus(node.id)}>
              {node.status === 'online' ? 'إيقاف العقدة' : 'تشغيل العقدة'}
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <input 
          value={inputText} 
          onChange={(e) => setInputText(e.target.value)}
          placeholder="أدخل بيانات لتخزينها موزعاً..."
          style={{ padding: '10px', width: '300px', marginLeft: '10px' }}
        />
        <button onClick={handleAddData} style={{ padding: '10px 20px' }}>حفظ وتوزيع</button>
      </div>

      <h2>السجلات الموزعة (Global Table)</h2>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
        <thead>
          <tr style={{ backgroundColor: '#f4f4f4' }}>
            <th>المحتوى</th>
            <th>الوقت</th>
            <th>العقد التي استلمت النسخة (Replicas)</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.content}</td>
              <td>{item.timestamp}</td>
              <td>{item.syncedNodes.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
