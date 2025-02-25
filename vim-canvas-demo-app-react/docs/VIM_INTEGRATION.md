# VIM Platform Integration and Audio Testing Guidelines

## Overview
This document provides guidance on integrating our ScribeAI functionality with the VIM platform. It addresses key questions around testing system audio within the VIM sandbox, and explains integration strategies for non-browser environments such as video conferencing applications (e.g., Zoom).

## Testing System Audio in the VIM Sandbox
- **Browser Limitations:**  
  The VIM sandbox is typically a browser-based environment. Due to built-in security and sandbox restrictions, direct capture of live system audio might be limited.  
- **How to Test Audio:**  
  - **Pre-recorded Audio:**  
    You can test the audio transcription functionality by uploading pre-recorded audio files. Our file transcription endpoint accepts these files and returns the corresponding transcript.
  - **Live Transcription:**  
    For live audio testing, the provided WebSocket integration simulates live transcription in real-time. However, note that this method relies on the browser's permissions and may not capture all system audio scenarios exactly.
  
## Integration with Non-Browser Environments (e.g., Zoom)
- **Native Applications:**  
  When using applications like Zoom that are not browser-based, standard browser audio capture is not applicable.
- **Alternative Approach:**  
  In such cases, you can:
  - Capture the audio using the native features of the application.
  - Process or store the audio locally.
  - Forward the recorded audio file to our API endpoints for transcription and note generation.
- This decoupling allows you to integrate our transcription services into various environments—even when system audio is not accessible through a web browser.

## Security and Authentication
- **Authentication:**  
  Every API request requires a valid JWT token, as outlined in the ScribeAI API guide and the VIM documentation.  
- **Best Practices:**  
  Adhere to VIM's security guidelines to ensure that audio data processing and API interactions are secure (please refer to [VIM Documentation](https://docs.getvim.com) for full details).

## Additional Resources
- **VIM Documentation:**  
  [https://docs.getvim.com](https://docs.getvim.com)
- **vim-scribeai GitHub Repository:**  
  [https://github.com/ezam0000/vim-scribeai](https://github.com/ezam0000/vim-scribeai)

## Summary
- **VIM Sandbox Testing:**  
  - Using pre-recorded audio uploads and simulated live transcription can help in testing audio functionalities.
  - Direct system audio capture may be affected by browser sandbox restrictions.
- **Non-Browser Integration:**  
  - For applications like Zoom, capture audio externally and then forward it for transcription.
- **Security:**  
  - Always use proper authentication and follow recommended security protocols when interacting with the API.

By following these guidelines, you can provide a clear answer to potential customers regarding the integration and testing capabilities when using the VIM platform. 