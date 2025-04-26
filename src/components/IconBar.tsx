import React from "react";
import * as S from "./IconBar.styles"; // Renamed styles import
import { FaGamepad, FaFilm, FaChartLine, FaImage, FaMapSigns } from "react-icons/fa"; // Import appropriate icons

export type DrawerItemType = "games" | "movies" | "dex" | "image" | 'roadmap';

interface IconBarProps {
  onSelectItem: (itemType: DrawerItemType) => void;
  closeOverlay: () => void;
}

const IconBar: React.FC<IconBarProps> = ({ onSelectItem, closeOverlay }) => {
  return (
    <S.IconBarContainer>
      <S.Logo
        onClick={closeOverlay} // <-- Call closeOverlay on click
        title="Close Tool" // Add a tooltip
        src={process.env.PUBLIC_URL + "/plio-logo.png"}
        alt="Plio Logo"
      />
      <S.IconButton onClick={() => onSelectItem("games")} title="Game Torrents">
        {/*@ts-ignore*/}
        <FaGamepad />
      </S.IconButton>
      <S.IconButton
        onClick={() => onSelectItem("movies")}
        title="Movie Torrents"
      >
        {/*@ts-ignore*/}
        <FaFilm />
      </S.IconButton>
      <S.IconButton onClick={() => onSelectItem("dex")} title="Dex Paid Tokens">
        {/*@ts-ignore*/}
        <FaChartLine />
      </S.IconButton>
      <S.IconButton
        onClick={() => onSelectItem("image")}
        title="Image Generator"
      >
        {/*@ts-ignore*/}
        <FaImage />
      </S.IconButton>
        <S.IconButton onClick={() => onSelectItem('roadmap')} title="Project Roadmap">
            {/*@ts-ignore*/}
            <FaMapSigns />
        </S.IconButton>
    </S.IconBarContainer>
  );
};

export default IconBar;
