import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";
import { Box } from "zmp-ui";

interface FilterBoxProps {
  isOpen: boolean;
  children: ReactNode;
}

const FilterBox: React.FC<FilterBoxProps> = ({ isOpen, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="FilterBox-box"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          style={{ overflow: "hidden" }}
        >
          <Box p={3} mb={3} className="bg-gradient-to-br from-bg-color to-white filter">
            <div className="grid grid-cols-12 gap-3">{children}</div>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FilterBox;
