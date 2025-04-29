import React from "react";
import * as S from "./IconBar.styles"; // Renamed styles import
import {
    FaChartLine,
    FaImage,
    FaMapSigns,
    FaComments,
    FaCoins,
    FaSearchDollar,
    FaUsers, FaCommentDots,
} from "react-icons/fa"; // Import appropriate icons

export type DrawerItemType =
  | "games"
  | "movies"
  | "dex"
  | "volume"
  | "image"
  | "roadmap"
  | "chat"
  | "market"
  | "kol"
    | "globalChat";

interface IconBarProps {
  onSelectItem: (itemType: DrawerItemType) => void;
  closeOverlay: () => void;
  restrictedFeatures: DrawerItemType[];
}

const IconBar: React.FC<IconBarProps> = ({ onSelectItem, closeOverlay, restrictedFeatures }) => {

    const isGated = (itemType: DrawerItemType) =>
        restrictedFeatures.includes(itemType);

    return (
        <S.IconBarContainer>
            <S.ButtonScrollArea>
            <S.Logo
                onClick={closeOverlay}
                title="Close Tool"
                src={process.env.PUBLIC_URL + "/plio-logo.png"}
                alt="Plio Logo"
            />
            <S.IconButton
                onClick={() => onSelectItem("roadmap")}
                title="Project Roadmap"
                isGated={isGated("roadmap")} // <-- Check if gated
            >
                <FaMapSigns />
            </S.IconButton>
            <S.IconButton
                onClick={() => onSelectItem("chat")}
                title="AI Chat"
                isGated={isGated("chat")} // <-- Check if gated
            >
                <FaComments />
            </S.IconButton>
            <S.IconButton
                onClick={() => onSelectItem("market")}
                title="Crypto Market"
                isGated={isGated("market")} // <-- Check if gated
            >
                <FaCoins />
            </S.IconButton>
            <S.IconButton
                onClick={() => onSelectItem("dex")}
                title="Dex Paid Tokens"
                isGated={isGated("dex")} // <-- Check if gated
            >
                <FaChartLine />
            </S.IconButton>
            <S.IconButton
                onClick={() => onSelectItem("volume")}
                title="Tokens Pumping NOW"
                isGated={isGated("volume")} // <-- Check if gated
            >
                <FaSearchDollar />
            </S.IconButton>
            <S.IconButton
                onClick={() => onSelectItem("image")}
                title="Image Generator"
                isGated={isGated("image")} // <-- Check if gated
            >
                <FaImage />
            </S.IconButton>
            <S.IconButton
                onClick={() => onSelectItem("kol")}
                title="KOL Tracker"
                isGated={isGated("kol")} // <-- Check if gated
            >
                <FaUsers />
            </S.IconButton>
            <S.IconButton
                onClick={() => onSelectItem("globalChat")}
                title="Global Chat"
                isGated={isGated("globalChat")} // <-- Check if gated
            >
                <FaCommentDots />
            </S.IconButton>
                </S.ButtonScrollArea>
        </S.IconBarContainer>
    );
};

export default IconBar;