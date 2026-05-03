/**
 * API Base URL for the mobile application.
 * 
 * If you are testing on an Android Emulator or physical device,
 * `localhost` will not point to your computer's Next.js server.
 * Create a `.env` file in the `mobile` directory with:
 * EXPO_PUBLIC_API_URL=http://<YOUR_PC_IP>:3000
 */

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
