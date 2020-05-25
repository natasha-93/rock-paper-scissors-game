import React, { useReducer } from "react";
import { Theme, makeStyles, createStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import { ReactComponent as RockIcon } from "./img/hands-rock.svg";
import { ReactComponent as PaperIcon } from "./img/hands-paper.svg";
import { ReactComponent as ScissorsIcon } from "./img/hands-scissors.svg";

type Choice = "Rock" | "Paper" | "Scissors";

const choiceIconMap: Record<Choice, React.ComponentType> = {
  Rock: RockIcon,
  Paper: PaperIcon,
  Scissors: ScissorsIcon,
};

type AppState = {
  playerScore: number;
  computerScore: number;
  playerChoice: Choice | null;
  computerChoice: Choice | null;
};

type Actions =
  | { type: "PLAYER_PICK"; payload: Choice }
  | { type: "RESET_GAME" };

const defaultState: AppState = {
  playerScore: 0,
  computerScore: 0,
  playerChoice: null,
  computerChoice: null,
};

const chooseRPS = (): Choice => {
  const x = Math.random();
  if (x < 0.34) return "Rock";
  if (x < 0.67) return "Paper";
  return "Scissors";
};

function reducer(state: AppState, action: Actions) {
  switch (action.type) {
    case "RESET_GAME":
      return { ...state, playerChoice: null, computerChoice: null };
    case "PLAYER_PICK": {
      const playerChoice = action.payload;
      const computerChoice = chooseRPS();
      const winner = findWinner(playerChoice, computerChoice);

      return {
        ...state,
        playerChoice,
        computerChoice,
        playerScore:
          winner === "PLAYER" ? state.playerScore + 1 : state.playerScore,
        computerScore:
          winner === "COMPUTER" ? state.computerScore + 1 : state.computerScore,
      };
    }
    default:
      return state;
  }
}

function findWinner(
  playerChoice: Choice,
  computerChoice: Choice
): "PLAYER" | "COMPUTER" | "DRAW" {
  const playerIndex = choices.findIndex((c) => c === playerChoice);
  const computerIndex = choices.findIndex((c) => c === computerChoice);

  if (playerIndex - computerIndex === 1) {
    return "PLAYER";
  } else if (computerIndex - playerIndex === 1) {
    return "COMPUTER";
  } else if (playerIndex - computerIndex === 2) {
    return "COMPUTER";
  } else if (computerIndex - playerIndex === 2) {
    return "PLAYER";
  } else {
    return "DRAW";
  }
}

const choices: Choice[] = ["Rock", "Paper", "Scissors"];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    icon: {
      fontSize: `${theme.spacing(8)}px`,
    },
  })
);

function App() {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const classes = useStyles();
  const isOver = state.playerChoice != null;
  const winner =
    state.playerChoice != null && state.computerChoice != null
      ? findWinner(state.playerChoice, state.computerChoice)
      : null;

  return (
    <div style={{ margin: "auto" }}>
      <h2>Rock, Paper, Scissors</h2>
      <Button
        disabled={!isOver}
        onClick={() => dispatch({ type: "RESET_GAME" })}
      >
        Restart Game
      </Button>
      <div>
        <p>Player 1: {state.playerScore}</p>
        <p>Computer: {state.computerScore}</p>
      </div>
      <h3>Make Your Selection</h3>
      <div>
        {choices.map((choice) => {
          const Icon = choiceIconMap[choice];

          return (
            <Button
              className={classes.icon}
              disabled={isOver}
              key={choice}
              onClick={() => dispatch({ type: "PLAYER_PICK", payload: choice })}
            >
              <Icon />
            </Button>
          );
        })}

        <Dialog open={isOver}>
          Game Over
          {winner === "DRAW" ? (
            <div>It's a draw!</div>
          ) : (
            <div>
              {winner} wins! Computer chose {state.computerChoice}
            </div>
          )}
          <IconButton
            onClick={(e) => {
              dispatch({ type: "RESET_GAME" });
            }}
          >
            Reset Game
          </IconButton>
        </Dialog>
      </div>
    </div>
  );
}

export default App;
