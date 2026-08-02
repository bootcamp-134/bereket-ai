import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { APP_VERSION } from "./common/app-version";

const SWAGGER_UI_VERSION = "5.32.8";
const SWAGGER_UI_CDN = `https://cdn.jsdelivr.net/npm/swagger-ui-dist@${SWAGGER_UI_VERSION}`;

function buildSwaggerHtml(): string {
  return `<!doctype html>
<html lang="tr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Bereket AI API</title>
    <link rel="stylesheet" href="${SWAGGER_UI_CDN}/swagger-ui.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="${SWAGGER_UI_CDN}/swagger-ui-bundle.js"></script>
    <script src="${SWAGGER_UI_CDN}/swagger-ui-standalone-preset.js"></script>
    <script>
      window.addEventListener("load", () => {
        window.ui = SwaggerUIBundle({
          url: "/api/docs-json",
          dom_id: "#swagger-ui",
          deepLinking: true,
          presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
          layout: "StandaloneLayout",
          persistAuthorization: true
        });
      });
    </script>
  </body>
</html>`;
}

export function configureSwagger(app: INestApplication): void {
  const swaggerConfig = new DocumentBuilder()
    .setTitle("Bereket AI Backend API")
    .setDescription(
      "Bereket AI hesap, profil, tarif önerisi ve tarif sohbeti API'si.",
    )
    .setVersion(APP_VERSION)
    .addServer("https://api.bereket.app", "Production")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup("api/docs", app, document, {
    jsonDocumentUrl: "api/docs-json",
    ui: false,
  });

  app.getHttpAdapter().get("/api/docs", (_request, response) => {
    response.type("text/html").send(buildSwaggerHtml());
  });
}
