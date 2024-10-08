import { useState } from "react";
import useCardPile, { UseCardPile } from "./useCardPile";
import { CardType } from "../Components/GameTable";

export type UseDrawPile = UseCardPile & {
  evaluateDrop: (card: CardType) => boolean;
  drawCard: () => void;
  faceUpCards: CardType[];
  faceDownCards: CardType[];
};

const useDrawPile: (
  name: string,
  isDragging: boolean,
  setHighlightedStack: React.Dispatch<React.SetStateAction<string | null>>,
  initCards: CardType[],
  undo: React.RefObject<(() => void)[]>
) => UseDrawPile = (name, isDragging, setHighlightedStack, initCards, undo) => {
  const [cards, setCards] = useState<CardType[]>([...initCards]);

  const [faceUpCards, setFaceUpCards] = useState<CardType[]>([]);
  const [faceDownCards, setFaceDownCards] = useState<CardType[]>([...cards]);

  const { onMouseEnter, onMouseLeave } = useCardPile(
    name,
    isDragging,
    setHighlightedStack,
    setCards
  );

  const evaluateDrop: (card: CardType) => boolean = (card) => {
    return false;
  };

  const addCards: (card: CardType[]) => void = (card) => {
    setFaceUpCards((curr) => [...curr, ...card]);
  };

  const removeCards: (card: CardType[]) => void = () => {
    setFaceUpCards((curr) => curr.slice(0, curr.length - 1));
  };

  const drawCard: () => void = () => {
    if (faceDownCards.length === 0) {
      setFaceDownCards([...faceUpCards]);
      setFaceUpCards([]);

      undo.current!.push(() => {
        setFaceDownCards([]);
        setFaceUpCards([...faceUpCards]);
      });
    } else {
      const cardToMove = faceDownCards[0];
      setFaceUpCards([...faceUpCards, cardToMove]);
      setFaceDownCards(faceDownCards.slice(1));

      undo.current!.push(() => {
        setFaceDownCards((curr) => [cardToMove, ...curr]);
        setFaceUpCards((curr) => curr.slice(0, curr.length - 1));
      });
    }
  };

  return {
    onMouseEnter,
    onMouseLeave,
    evaluateDrop,
    addCards,
    removeCards,
    drawCard,
    faceUpCards,
    faceDownCards,
  };
};

export default useDrawPile;
