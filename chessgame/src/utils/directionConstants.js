export const createDirections = (direction) => {
  if (direction === "straight") {
    return {
      up: {
        legalMoves: [],
        attackTile: [],
        protectingTile: [],
        blocked: false,
      },
      down: {
        legalMoves: [],
        attackTile: [],
        protectingTile: [],
        blocked: false,
      },
      left: {
        legalMoves: [],
        attackTile: [],
        protectingTile: [],
        blocked: false,
      },
      right: {
        legalMoves: [],
        attackTile: [],
        protectingTile: [],
        blocked: false,
      },
    };
  } else if (direction === "diagonal") {
    return {
      up: {
        legalMoves: [],
        attackTile: [],
        protectingTile: [],
        blocked: false,
      },
      down: {
        legalMoves: [],
        attackTile: [],
        protectingTile: [],
        blocked: false,
      },
      left: {
        legalMoves: [],
        attackTile: [],
        protectingTile: [],
        blocked: false,
      },
      right: {
        legalMoves: [],
        attackTile: [],
        protectingTile: [],
        blocked: false,
      },
    };
  } else if (direction === "both") {
    return {
      straightDirections: {
        up: {
          legalMoves: [],
          attackTile: [],
          protectingTile: [],
          blocked: false,
        },
        down: {
          legalMoves: [],
          attackTile: [],
          protectingTile: [],
          blocked: false,
        },
        left: {
          legalMoves: [],
          attackTile: [],
          protectingTile: [],
          blocked: false,
        },
        right: {
          legalMoves: [],
          attackTile: [],
          protectingTile: [],
          blocked: false,
        },
      },
      diagonalDirections: {
        up: {
          legalMoves: [],
          attackTile: [],
          protectingTile: [],
          blocked: false,
        },
        down: {
          legalMoves: [],
          attackTile: [],
          protectingTile: [],
          blocked: false,
        },
        left: {
          legalMoves: [],
          attackTile: [],
          protectingTile: [],
          blocked: false,
        },
        right: {
          legalMoves: [],
          attackTile: [],
          protectingTile: [],
          blocked: false,
        },
      },
    };
  } else {
    throw new Error(
      "Invalid Direction specified, need straight, diagonal or both"
    );
  }
};

export const createPawnDirections = (color) => {
  return {
    normal: {
      up: { legalMoves: [], attackTile: [], blocked: color === "black" },
      down: { legalMoves: [], attackTile: [], blocked: color === "white" },
      left: { legalMoves: [], attackTile: [], blocked: true },
      right: { legalMoves: [], attackTile: [], blocked: true },
    },
    attack: {
      up: {
        legalMoves: [],
        protectingTile: [],
        attackTile: [],
        blocked: color === "black",
      },
      down: {
        legalMoves: [],
        attackTile: [],
        protectingTile: [],
        blocked: color === "white",
      },
      left: {
        legalMoves: [],
        protectingTile: [],
        attackTile: [],
        blocked: true,
      },
      right: {
        legalMoves: [],
        protectingTile: [],
        attackTile: [],
        blocked: true,
      },
    },
  };
};
