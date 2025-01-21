import React, { useEffect, useState } from 'react';

import { confettiAtom, walletConnectModalAtom } from '@atoms/index';
import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';

import { Banana } from '@assets/imges';

interface ConfettiPiece {
  delay: number;
  id: number;
  rotate: number;
  x: number;
  y: number;
}

const generateConfettiPieces = (numPieces: number): ConfettiPiece[] => {
  const pieces: ConfettiPiece[] = [];
  for (let i = 0; i < numPieces; i += 1) {
    pieces.push({
      id: i,
      delay: Math.random() * 2,
      rotate: Math.random() * 360,
      x: Math.random() * window.innerWidth,
      y: -100,
    });
  }
  return pieces;
};

const BananaConfetti: React.FC = () => {
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);
  const [, setIsOpen] = useAtom(walletConnectModalAtom);

  const [confettiState, setConfettiState] = useAtom(confettiAtom);

  useEffect(() => {
    if (confettiState.isConfettiActive && confettiState.interval > 1000) {
      setConfettiPieces(generateConfettiPieces(100));
    } else {
      setConfettiPieces([]);
    }
  }, [confettiState.interval, confettiState.isConfettiActive]);

  const handleAnimationComplete = () => {
    setTimeout(() => {
      setIsOpen(true);
      setConfettiPieces([]);
      setIsOpen(false);
      setConfettiState({ ...confettiState, isConfettiActive: false });
    }, 200);
  };

  const windowHeight = window.innerHeight;
  const animationDuration = windowHeight / 250;

  return (
    <Box>
      {confettiPieces.map((piece) => (
        <motion.img
          animate={{
            opacity: [1, 1, 0],
            rotate: [piece.rotate, piece.rotate + 360],
            y: [piece.y, piece.y + windowHeight + 1500],
          }}
          style={{
            height: '100px',
            position: 'absolute',
            width: '100px',
          }}
          transition={{
            delay: piece.delay,
            duration: animationDuration,
            ease: 'easeInOut',
          }}
          alt="confetti"
          initial={{ opacity: 1, rotate: piece.rotate, x: piece.x, y: piece.y }}
          key={piece.id}
          onAnimationComplete={handleAnimationComplete}
          src={Banana}
        />
      ))}
    </Box>
  );
};

export default BananaConfetti;
