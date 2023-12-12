export async function unloadServiceWorkerAndRefresh() {
  try {
    const registrations = await navigator.serviceWorker.getRegistrations();

    await Promise.all(
      registrations.map((registration) => registration.unregister())
    );
  } finally {
    window.location.href = "/";
  }
}

export function decodeEntities(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

export function shouldRefreshSeenPosts(refreshTime) {
  // Get the current time in milliseconds
  const currentTime = new Date().getTime();

  // Get the time of the input date in milliseconds
  const inputTime = refreshTime.getTime();

  // Calculate the difference in milliseconds between current time and input time
  const timeDifference = currentTime - inputTime;

  // Calculate the number of milliseconds in 24 hours
  const twentyFourHoursInMilliseconds = 24 * 60 * 60 * 1000;

  // Check if the time difference is greater than 24 hours
  return timeDifference > twentyFourHoursInMilliseconds;
}
