import { Avatar, Button, Divider, Flex, Grid, TextInput } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { closeAllModals, openModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import React, { useState } from "react";
import { Save, User } from "react-feather";
import { useForm } from "react-hook-form";
import UploadProfileImage from "../../components/RegisterUser/helpers/UploadProfileImage.tsx/UploadProfileImage";
import { Database } from "../../../types/database.types";
import constants from "../../constants/constants";
import useGlobalStore from "../../store/useGlobalStore";

interface IFormValues {
  name: string;
}

const TestPage = (): JSX.Element => {
  const { user, setUser } = useGlobalStore();
  const session = useSession();
  const supabase = useSupabaseClient<Database>();


  return (
    <div>
      <button onClick={async () => 
      {
            const response = await fetch(
              `http://localhost:7998/chat/completions`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${session?.access_token}`,
                },
                body: JSON.stringify({
                  stop,
                  model: "gpt-3.5-turbo-0125",
                  frequency_penalty: 0,
                  presence_penalty: 0,
                  messages: [
                    {
                      role: "user",
                      content: "Please respond to this English text with a French translation: 'I love you'",
                    },
                  ],
                }),
              },
            );
            try {
              // check if error
        
              if (response.status !== 200) {
                // console.log(response.statusText);
                // console.log(response.status);
                console.log(await response.text());
                throw new Error(
                  'OpenAI API Error: ' + response.status + ' ' + response.statusText
                );
              }
        
              // if response has an error
              if (!response.ok) {
                throw new Error("Error in response: " + response.statusText);
              }
        
              const body = await response.json();
        
              const content = body.choices?.[0]?.message?.content;
              if (!content) {
                throw new Error("No content in response", body);
              }
              console.log('content is', content)
              window.alert(content);
            } catch (error) {
              throw new Error(error as any);
            }
      }}>Try request</button>
    </div>
  );
};

export default TestPage;
