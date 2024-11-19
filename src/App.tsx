import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendNotifications } from './services/email';
import './App.css';

interface Presence {
  user: string;
  date: string;
  time: string;
  timestamp: number;
}

function App() {
  const [presences, setPresences] = useState<Presence[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const users = ['Ellis', 'Eythan', 'Joa'];
  
  const handlePresence = async () => {
    if (!selectedUser) return;
    
    const now = new Date();
    const newPresence = {
      user: selectedUser,
      date: now.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: now.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      timestamp: now.getTime()
    };
    
    setPresences(prev => [newPresence, ...prev]);
    const others = users.filter(u => u !== selectedUser);
    await sendNotifications(selectedUser, others);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="app">
      <div className="gothic-border">
        <motion.div 
          className="content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            className="gothic-title"
            variants={itemVariants}
          >
            Deficit Watch
          </motion.h1>
          
          <motion.div 
            className="user-selector"
            variants={itemVariants}
          >
            {users.map(user => (
              <motion.button
                key={user}
                className={`user-button gothic-button ${selectedUser === user ? 'selected' : ''}`}
                whileHover={{ 
                  scale: 1.05,
                  textShadow: "0 0 8px rgb(184, 110, 255)",
                  boxShadow: "0 0 15px rgba(184, 110, 255, 0.5)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedUser(user)}
              >
                {user}
              </motion.button>
            ))}
          </motion.div>

          <AnimatePresence mode="wait">
            {selectedUser && (
              <motion.div
                className="check-in-container"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 200,
                    damping: 20
                  }
                }}
                exit={{ 
                  opacity: 0, 
                  scale: 0.8,
                  transition: {
                    duration: 0.2
                  }
                }}
              >
                <motion.button
                  className="check-in-button gothic-button"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 0 30px rgba(184, 110, 255, 0.8)"
                  }}
                  whileTap={{ 
                    scale: 0.98,
                    boxShadow: "0 0 15px rgba(184, 110, 255, 0.4)"
                  }}
                  onClick={handlePresence}
                >
                  <span className="button-text">Pointer</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div 
            className="history gothic-panel"
            variants={itemVariants}
          >
            <h2 className="gothic-subtitle">Historique des pointages</h2>
            <div className="history-list">
              <AnimatePresence>
                {presences.map((presence, i) => (
                  <motion.div
                    key={presence.timestamp}
                    className="history-item"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ 
                      x: 0, 
                      opacity: 1,
                      transition: {
                        type: "spring",
                        stiffness: 100,
                        damping: 12,
                        delay: i * 0.1
                      }
                    }}
                    exit={{ 
                      x: 50, 
                      opacity: 0,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <div className="history-user">{presence.user}</div>
                    <div className="history-details">
                      <span>{presence.date}</span>
                      <span className="history-time">{presence.time}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default App; 