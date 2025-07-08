import React from 'react'
import { motion } from 'framer-motion'
import { useWhiteboard } from '@/contexts/WhiteboardContext'

export const UserCursors: React.FC = () => {
  const { users } = useWhiteboard()

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {users.map((user) => {
        if (!user.cursor) return null

        return (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
              position: 'absolute',
              left: user.cursor.x,
              top: user.cursor.y,
              pointerEvents: 'none',
            }}
            className="flex items-center space-x-2"
          >
            {/* Cursor */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className="transform -translate-x-1 -translate-y-1"
            >
              <path
                d="M12 2L2 7v10c0 5.55 3.84 10 10 10s10-4.45 10-10V7l-10-5z"
                fill={user.color}
                stroke="white"
                strokeWidth="2"
              />
            </svg>

            {/* User name */}
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-2 py-1 bg-black text-white text-xs rounded-md whitespace-nowrap"
              style={{ backgroundColor: user.color }}
            >
              {user.name}
            </motion.div>
          </motion.div>
        )
      })}
    </div>
  )
}
