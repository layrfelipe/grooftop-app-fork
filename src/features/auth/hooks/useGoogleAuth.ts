import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useCallback } from 'react';

WebBrowser.maybeCompleteAuthSession();

// Get these from Google Cloud Console
const GOOGLE_CLIENT_ID = '687778051077-d2rt3ihaln8cv9tg54ighkkqko6m9e6m.apps.googleusercontent.com';
const ANDROID_CLIENT_ID = '687778051077-1fd1b3jj7c2mc80sa6rko9hgjge7edts.apps.googleusercontent.com';

export const useGoogleAuth = () => {
  const [_, response, promptAsync] = Google.useAuthRequest({
    androidClientId: ANDROID_CLIENT_ID,
    clientId: GOOGLE_CLIENT_ID,
    responseType: 'id_token',
  });

  const signIn = useCallback(async () => {
    try {
      const result = await promptAsync();
      if (result.type !== 'success') {
        throw new Error('Google authentication failed');
      }

      const idToken = result.params?.id_token;
      if (!idToken) {
        throw new Error('No ID token received from Google');
      }

      return idToken;
    } catch (error) {
      console.error('Google sign in failed:', error);
      throw error;
    }
  }, [promptAsync]);

  return {
    signIn,
  };
}; 