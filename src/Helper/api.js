const BASE_URL = 'https://api-app-staging.wobot.ai/app/v1';
const TOKEN = '4ApVMIn5sTxeW7GQ5VWeWiy';

export const fetchCameras = async () => {
  const response = await fetch(`${BASE_URL}/fetch/cameras`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  const result = await response.json();
  console.log(result.data)
  return result.data; // Adjust based on actual API response structure
};

export const updateCameraStatus = async (id, status) => {
    debugger
  const response = await fetch(`${BASE_URL}/update/camera/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ id, status }),
  });
  return response.json();
};