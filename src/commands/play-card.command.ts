import { GameCommand } from "./game.command";
import { GameState } from "../models/game-state.model";
import { Value } from "../models/values.model";
import { isValidColor, Color } from "../models/color.model";

export class PlayCardCommand extends GameCommand {
  private readonly playerId: string;
  private readonly cardId: string;

  constructor(playerId: string, cardId: string) {
    super();

    this.playerId = playerId;
    this.cardId = cardId;
  }

  execute(state: GameState) {
    const player = state.playersGroup.getPlayerById(this.playerId);

    if (!player) {
      console.error("No ha sido posible encontrar al jugador en la partida");

      throw new Error("No ha sido posible encontrar al jugador en la partida");
    }

    if (!state.turn.player) {
      console.error("No hay un turno activo");

      throw new Error("No hay un turno activo");
    }

    if (player.id !== state.turn.player.id) {
      console.error("No es el turno del jugador");

      throw new Error("No es el turno del jugador");
    }

    const handCard = player.hand.cards.find(
      (handCard) => handCard.id === this.cardId
    );

    if (!handCard) {
      console.error("No se ha encontrado la carta de la mano del jugador");

      throw new Error("No se ha encontrado la carta de la mano del jugador");
    }

    if (state.stack.cardOnTop && !handCard.isPlayable(state.stack.cardOnTop)) {
      console.error(
        "La carta que quiere tirar no tiene el mismo color o valor que la del stack"
      );

      throw new Error(
        "La carta que quiere tirar no tiene el mismo color o valor que la del stack"
      );
    }

    
    state.turn.player.hand.removeCard(handCard);
    
    state.stack.addCard(handCard);
    
    if (handCard.value === Value.WILDCARD || handCard.value === Value.PLUS_FOUR) {
      let newColor;
      // TODO: Cambiar el metodo de entrada del color
      // TODO: hacer la validación de color en changePlayableColor
      while (!isValidColor(newColor as Color)) {
        newColor = prompt(
          "Escribe el nuevo color a jugar: azul, rojo, verde o amarillo"
        );
      }
      state.changePlayableColor(newColor as Color);
    }

    if(handCard.value === Value.PLUS_FOUR) {
      state.giveCards(4);
    }

    if (handCard.value === Value.REVERSE) {
      state.changeDirection();
    }

    console.log(
      `El jugador ${state.turn.player?.id} ha tirado la carta ${this.cardId} al stack`
    );
  }
}