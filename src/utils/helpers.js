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
