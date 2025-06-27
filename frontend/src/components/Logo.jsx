"use client"
import { motion } from "framer-motion"

export function PharmasphereLogoText() {
  return (
    <motion.div
      className="flex items-center gap-2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center">
        <span className="text-white font-bold text-lg">P</span>
      </div>
      <span className="font-heading text-xl font-bold text-gray-900">Pharmasphere</span>
    </motion.div>
  )
}
