use tauri::{Url, WebviewUrl, WebviewWindow, WebviewWindowBuilder};

const RELEASE_LOCALHOST_PORT: u16 = 9527;

fn frontend_url() -> String {
  if cfg!(debug_assertions) {
    "http://localhost:5173".to_string()
  } else {
    format!("http://localhost:{RELEASE_LOCALHOST_PORT}")
  }
}

#[tauri::command]
async fn clear_wrike_session_cookies(window: WebviewWindow, host: Option<String>) -> Result<(), String> {
  let mut urls = vec!["https://login.wrike.com".to_string(), "https://www.wrike.com".to_string()];

  if let Some(host) = host {
    urls.push(format!("https://{host}"));
  }

  for raw_url in urls {
    let url = Url::parse(&raw_url).map_err(|error| error.to_string())?;
    let cookies = window.cookies_for_url(url).map_err(|error| error.to_string())?;

    for cookie in cookies {
      window.delete_cookie(cookie).map_err(|error| error.to_string())?;
    }
  }

  Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  let mut builder = tauri::Builder::default().plugin(tauri_plugin_http::init());

  if !cfg!(debug_assertions) {
    builder = builder.plugin(tauri_plugin_localhost::Builder::new(RELEASE_LOCALHOST_PORT).build());
  }

  builder
    .invoke_handler(tauri::generate_handler![clear_wrike_session_cookies])
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }

      let mut window_config = app
        .config()
        .app
        .windows
        .first()
        .expect("missing main window config")
        .clone();
      window_config.url = WebviewUrl::External(
        frontend_url()
          .parse()
          .expect("frontend URL must be a valid http URL"),
      );

      WebviewWindowBuilder::from_config(app.handle(), &window_config)?.build()?;
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
