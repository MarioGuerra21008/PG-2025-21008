## Diseño e implementación de ciberseguridad y aseguramiento de calidad para una plataforma web de gestión administrativa para un ingenio azucarero en Guatemala (PG-2025-21008)

---

## Descripción

Este proyecto implementa un módulo integral de ciberseguridad y aseguramiento de calidad para una plataforma de gestión administrativa de formularios agrícolas del Ingenio Santa Ana. El módulo abarca la implementación completa de prácticas DevSecOps, incluyendo:

- **Análisis de seguridad automatizado** con múltiples herramientas (Snyk, SonarCloud, OWASP ZAP, TruffleHog)
- **Suite completa de pruebas** incluyendo unitarias, integración y end-to-end
- **Infraestructura como Código (IaC)** con Terraform para despliegue en Google Cloud Platform
- **Pipeline CI/CD** automatizado con GitHub Actions
- **Implementación de seguridad web** con Content Security Policy, OAuth 2.0, SSL/TLS

El proyecto resuelve la necesidad de garantizar la calidad, seguridad y confiabilidad del software mediante la integración de prácticas modernas de desarrollo seguro y pruebas automatizadas.

En este repositorio, se cuenta con todos los archivos creados para este proyecto. Contando con las pruebas automatizadas en frontend y backend, como también con los archivos de despliegue y contenerización, flujos de trabajo y de infraestructura como código. Los repositorios en los cuales se pueden mover y ejecutar las pruebas y los flujos de trabajo se encuentran más adelante en este README.

---

## Tecnologías Utilizadas

### Frontend
- React 18 con TypeScript
- Vite como bundler
- Jest + React Testing Library
- Mocha
- Cypress
- Selenium con LambdaTest

### Backend
- Django 5.0
- Python 3.11
- PostgreSQL 14+
- Pytest
- Gunicorn

### Seguridad y Calidad
- Snyk (análisis de vulnerabilidades)
- SonarCloud (calidad de código)
- OWASP ZAP (pruebas de seguridad)
- TruffleHog (detección de secretos)

### Infraestructura
- Docker
- Terraform
- Google Cloud Run
- Google Cloud Armor
- Nginx 1.27.5

### CI/CD
- GitHub Actions
- Docker Hub

---

## Requisitos Previos

### Software Necesario
- **Node.js** v18+
- **Python** 3.11+
- **Docker** 20.10+
- **Terraform** 1.5+
- **Google Cloud SDK**
- **Yarn** (gestor de paquetes)

### Cuentas y Servicios
- Cuenta de Google Cloud Platform con billing habilitado
- Cuenta de Snyk
- Cuenta de LambdaTest para Selenium
- Docker Hub para almacenamiento de imágenes

---

## Instalación

### 1. Clonar los Repositorios

```bash
git clone https://github.com/MarioGuerra21008/PG-2025-21008
cd PG-2025-21008
```

#### Frontend
```bash
git clone https://github.com/santa-ana-agroforms/santa-ana-agroforms.git
cd santa-ana-agroforms
git checkout qa-cybersecurity-results
```

#### Backend
```bash
git clone https://github.com/santa-ana-agroforms/backend-santa-ana-agroforms.git
cd backend-santa-ana-agroforms
git checkout qa-security-results
```

#### Infraestructura
```bash
git clone https://github.com/santa-ana-agroforms/santa-ana-agroforms-web-infrasctructure.git
cd santa-ana-agroforms-web-infrasctructure
```

### 2. Instalar Dependencias

#### Frontend
```bash
cd santa-ana-agroforms
yarn install
```

#### Backend
```bash
cd backend-santa-ana-agroforms
pip install -r requirements.txt
```

### 3. Configurar Variables de Entorno

#### Frontend
```bash
cp src/.env.example src/.env
# Editar .env con las configuraciones correspondientes
```

#### Backend
```bash
cp .env.example .env
# Configurar variables de base de datos y API keys
```

---

## Ejecución del Proyecto

### Ejecutar Frontend (Desarrollo)
```bash
cd santa-ana-agroforms
yarn dev
```
El frontend estará disponible en `http://localhost:5173`

### Ejecutar Backend (Desarrollo)
```bash
cd backend-santa-ana-agroforms
python manage.py runserver 8081
```
El backend estará disponible en `http://localhost:8081`

---

## Pruebas y Seguridad

### Análisis de Seguridad con Snyk

#### Autenticación
```bash
snyk auth
```

#### Ejecutar análisis en todos los proyectos (frontend y backend)
```bash
snyk test --all-projects --org=key-de-la-organizacion
```

### Pruebas Unitarias

#### Frontend - Jest
```bash
cd santa-ana-agroforms
yarn test
```

#### Backend - Pytest
```bash
cd backend-santa-ana-agroforms
pytest
```

#### Backend con cobertura
```bash
pytest --cov=. --cov-report=xml:coverage.xml --cov-report=term-missing
```

### Pruebas de Integración - Mocha
```bash
cd santa-ana-agroforms
yarn test:mocha
```

### Pruebas End-to-End

#### Cypress (CI Mode)
```bash
cd santa-ana-agroforms
yarn test:cypress:ci
```

#### Selenium + LambdaTest

**Paso 1:** Iniciar túnel de LambdaTest
```bash
LT.exe --user CorreoDeUsuarioDeLambdaTest --key AccessKeyDeLambdaTest --tunnelName NombreDeTunel
```

**Paso 2:** Ejecutar pruebas
```bash
yarn test:selenium:lambdatest
```
---

## Despliegue con Docker

### Construir Imagen del Frontend
```bash
cd santa-ana-agroforms
docker build -t mariogm45/santa-ana-frontend:latest .
```

### Ejecutar Contenedor Local
```bash
docker run -d --name test-frontend -p 8080:80 mariogm45/santa-ana-frontend:latest
```

Acceder en: `http://localhost:8080`

### Publicar en Docker Hub
```bash
docker push mariogm45/santa-ana-frontend:latest
```

---

## Infraestructura como Código (Terraform)

### Autenticación en GCP

```bash
# Autenticación de usuario
gcloud auth login

# Ver cuentas de billing
gcloud billing accounts list

# Vincular proyecto con billing
gcloud billing projects link NombreDelProyecto --billing-account=ID-De-La-Cuenta

# Autenticación de aplicación
gcloud auth application-default login

# Verificar proyecto actual
gcloud config get-value project

# Describir proyecto
gcloud projects describe NombreDelProyecto
```

### Despliegue en Google Cloud Run

```bash
cd santa-ana-agroforms-web-infrasctructure

# Inicializar Terraform
terraform init

# Validar configuración
terraform validate

# Ver plan de ejecución
terraform plan

# Aplicar infraestructura
terraform apply
```

### Verificación de Seguridad

#### Ver política de seguridad
```bash
gcloud compute security-policies describe NombrePoliticasDeSeguridad
```

#### Verificar configuración de ingress
```bash
gcloud run services describe NombreDelAmbiente \
  --region RegionDelProyecto \
  --format="value(metadata.annotations.'run.googleapis.com/ingress')"
```

---

## Demo

El video demostrativo se encuentra en `/demo/demo.mp4`

---

## Documentación

El informe final del proyecto está disponible en `/docs/informe_final.pdf`

---

## Autores

- **Mario Antonio Guerra Morales** - [21008]

---

## Enlaces Útiles

### Repositorios
- [Frontend](https://github.com/santa-ana-agroforms/santa-ana-agroforms/tree/qa-cybersecurity-results)
- [Backend](https://github.com/santa-ana-agroforms/backend-santa-ana-agroforms/tree/qa-security-results)
- [Infraestructura IaC](https://github.com/santa-ana-agroforms/santa-ana-agroforms-web-infrasctructure)

### Servicios en Producción
- [Frontend en Cloud Run](https://santa-ana-frontend-prod-h5ycrgmwda-uc.a.run.app)
- [Backend en Render](https://santa-ana-api.onrender.com)

---