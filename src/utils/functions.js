import { EXERCISES, SCHEMES, TEMPOS, WORKOUTS } from "./swoldier";

const exercises = flattenExercises(EXERCISES);

export function generateWorkout({ muscles, poison: workoutType, goal }) {
  const environment = "home";
  let allExerciseKeys = Object.keys(exercises).filter(
    (key) => exercises[key].meta.environment !== environment
  );

  let usedExercises = [];
  let targetMuscles;

  // Figure out which muscles to train
  if (workoutType === "individual") {
    targetMuscles = muscles;
  } else {
    targetMuscles = WORKOUTS[workoutType][muscles[0]];
  }

  // Shuffle and clean
  const muscleList = Array.from(new Set(shuffle(targetMuscles)));

  // Generate the workout structure based on scheme ratio
  const scheme = SCHEMES[goal];
  const sets = scheme.ratio
    .flatMap((count, i) =>
      Array.from({ length: count }, () => ({
        setType: i === 0 ? "compound" : "accessory",
      }))
    )
    .map((set, i) => ({
      ...set,
      muscleGroup: muscleList[i % muscleList.length],
    }));

  // Separate compound and accessory exercises
  const categorized = allExerciseKeys.reduce(
    (acc, key) => {
      const exercise = exercises[key];
      const belongs = exercise.muscles.some((m) => targetMuscles.includes(m));

      if (belongs) {
        acc[exercise.type][key] = exercise;
      }
      return acc;
    },
    { compound: {}, accessory: {} }
  );

  // Create the actual workout
  const workout = sets.map(({ setType, muscleGroup }) => {
    const pool = categorized[setType];
    const altPool =
      categorized[setType === "compound" ? "accessory" : "compound"];

    // Try filtering based on muscle group and not already used
    const valid = Object.entries(pool)
      .filter(
        ([key, ex]) =>
          !usedExercises.includes(key) && ex.muscles.includes(muscleGroup)
      )
      .map(([key]) => key);

    // Fallback if none match
    const fallback = Object.keys(altPool).filter(
      (key) => !usedExercises.includes(key)
    );

    const picked =
      valid[Math.floor(Math.random() * valid.length)] ||
      fallback[Math.floor(Math.random() * fallback.length)];

    if (!picked) return {};

    let repsOrTime =
      exercises[picked].unit === "reps"
        ? randomInRange(...scheme.repRanges) + (setType === "accessory" ? 4 : 0)
        : Math.floor(Math.random() * 40) + 20;

    const tempo = TEMPOS[Math.floor(Math.random() * TEMPOS.length)];

    if (exercises[picked].unit === "reps") {
      const totalTime =
        tempo.split(" ").reduce((sum, t) => sum + parseInt(t), 0) * repsOrTime;
      if (totalTime > 85) {
        repsOrTime = Math.floor(85 / (totalTime / repsOrTime));
      }
    } else {
      repsOrTime = Math.ceil(repsOrTime / 5) * 5;
    }

    usedExercises.push(picked);

    return {
      name: picked,
      tempo,
      rest: scheme.rest[setType === "compound" ? 0 : 1],
      reps: repsOrTime,
      ...exercises[picked],
    };
  });

  return workout.filter((ex) => Object.keys(ex).length > 0);
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function randomInRange(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}

function flattenExercises(exObj) {
  const result = {};

  for (const [name, data] of Object.entries(exObj)) {
    if (!data.variants) {
      result[name] = data;
    } else {
      for (const variant in data.variants) {
        const variantName = `${variant}_${name}`;
        const otherVariants = Object.keys(data.variants)
          .map((v) => `${v} ${name}`)
          .filter((v) => v.replaceAll(" ", "_") !== variantName);

        result[variantName] = {
          ...data,
          description: data.description + "___" + data.variants[variant],
          substitutes: [...data.substitutes, ...otherVariants].slice(0, 5),
        };
      }
    }
  }

  return result;
}
