
export const defaultGoal = {
    name: "First Time User Experience",
    description: "CJ wants to get to know the user.",
    status: "IN_PROGRESS", // other types are "DONE" and "FAILED"
    objectives: [
        {
            description: "Determine if it is the user's first time",
            condition: "User indicates that it is their first time or that they are new",
            completed: false,
        },
        {
            description: "Get the user to enable their microphone by pressing the microphone button",
            condition: "User calls microphone_enabled action",
            completed: false,
        },
        {
            description: "Learn details about the user's interests and personality",
            condition: "User tells CJ a few key facts about about their interests and personality",
            completed: false,
        },
        {
            description: "CJ updates the user's profile with the information she has learned",
            condition: "CJ calls update_profile action",
            completed: false,
        },
        {
            description: "Connect the user to someone from the rolodex who they might like to chat with",
            condition: "CJ calls INTRODUCE action",
            completed: false,
        },
    ],
};
