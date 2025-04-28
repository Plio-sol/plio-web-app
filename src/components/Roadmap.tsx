import React, { FC } from "react";
import * as S from "./Roadmap.styles";
import {
  FaGasPump,
  FaChartBar,
  FaBrain,
  FaBullhorn,
  FaAndroid,
} from "react-icons/fa";

interface RoadmapProps {
  onClose: () => void;
}

// Animation variants
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const modalVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15, delay: 0.1 },
  },
  exit: { opacity: 0, y: 30, scale: 0.95, transition: { duration: 0.2 } },
};

const cardVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const Roadmap: FC<RoadmapProps> = ({ onClose }) => {
  return (
    <S.OverlayContainer
      key="roadmap-overlay"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClose} // Close on overlay click
    >
      <S.ModalWindow
        variants={modalVariants}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <S.CloseButton onClick={onClose} aria-label="Close Roadmap">
          &times;
        </S.CloseButton>

        <S.Title>Project Roadmap</S.Title>
        <S.Subtitle>Upcoming Features & Enhancements</S.Subtitle>

        <S.RoadmapGrid
          variants={{
            visible: { transition: { staggerChildren: 0.15 } },
          }}
          initial="hidden"
          animate="visible"
        >
          <S.RoadmapCard variants={cardVariants}>
            <S.CardHeader>
              <S.FeatureIcon>
                <FaChartBar />
              </S.FeatureIcon>
              <S.CardTitle>Crypto Market Dashboard</S.CardTitle>
              <S.StatusBadge status="in-progress">In-Progress</S.StatusBadge>
            </S.CardHeader>
            <S.CardDescription>
              Show current prices for SOL and other major cryptos (BTC, ETH,
              PLIO, and more trending meme coins) directly within the panel.
              Automatic AI price analysis by Google Gemini so you always know
              where the market is headed. Powered by lightening fast price APIs.
            </S.CardDescription>
          </S.RoadmapCard>
          <S.RoadmapCard variants={cardVariants}>
            <S.CardHeader>
              <S.FeatureIcon>
                <FaGasPump />
              </S.FeatureIcon>
              <S.CardTitle>Solana Status & Gas Tracker</S.CardTitle>
              <S.StatusBadge status="planned">Planned</S.StatusBadge>
            </S.CardHeader>
            <S.CardDescription>
              Display key network health indicators like current TPS and
              estimated priority fees (gas) for low, medium, and high priority
              transactions. Helps you decide the best time to transact and know
              when the market is heating up 🔥.
            </S.CardDescription>
          </S.RoadmapCard>
          <S.RoadmapCard variants={cardVariants}>
            <S.CardHeader>
              <S.FeatureIcon>
                <FaBrain />
              </S.FeatureIcon>
              <S.CardTitle>AI Chat Context Enhancement</S.CardTitle>
              <S.StatusBadge status="planned">Researching</S.StatusBadge>
            </S.CardHeader>
            <S.CardDescription>
              Giving the chatbot complete, real-time context over the entire
              application state (like live wallet balances, dynamic API
              content). This involves advanced techniques like Function Calling
              or Retrieval-Augmented Generation (RAG), which I am exploring for
              future integration.
            </S.CardDescription>
          </S.RoadmapCard>
          <S.RoadmapCard variants={cardVariants}>
            <S.CardHeader>
              <S.FeatureIcon>
                <FaAndroid />
              </S.FeatureIcon>
              <S.CardTitle>Android Mobile App</S.CardTitle>
              <S.StatusBadge status="planned">Planned</S.StatusBadge>
            </S.CardHeader>
            <S.CardDescription>
              Develop a native Android application to bring the Plio Holder
              Panel features to mobile devices for enhanced accessibility and
              convenience. Potential for push notifications for market alerts
              and search feature for cracked APKs (free paid apps).
            </S.CardDescription>
          </S.RoadmapCard>
          <S.RoadmapCard variants={cardVariants}>
            <S.CardHeader>
              <S.FeatureIcon>
                <FaBullhorn />
              </S.FeatureIcon>
              <S.CardTitle>Ad-Funded Buybacks</S.CardTitle>
              <S.StatusBadge status="planned">Planned</S.StatusBadge>
            </S.CardHeader>
            <S.CardDescription>
              Incorporate unobtrusive advertisements for users who do not meet
              the $Plio holding requirement. Revenue generated from these ads
              will be used to facilitate buybacks of $Plio tokens, directly
              benefiting holders.
            </S.CardDescription>
          </S.RoadmapCard>
          {/* Add more cards here  */}
        </S.RoadmapGrid>
      </S.ModalWindow>
    </S.OverlayContainer>
  );
};

export default Roadmap;
