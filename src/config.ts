// CONFIG FOR THE FIELD
export const field = {
  width: 300,
  height: 300,
};

// CONFIG FOR THE PLAYBALL
export const playBall = {
  width: 50,
  get height() {
    return this.width;
  },
  get radius() {
    return this.width / 2;
  },
  color: "blue",
};

export const speedUnit = 3;
