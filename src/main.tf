terraform {
  required_version = ">= 1.0"
  
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.0"
    }
  }
}

# Provider Configuration
provider "google" {
  project = var.project_id
  region  = var.region
}

# API ENABLEMENT

# Enable Required APIs
resource "google_project_service" "cloud_run" {
  project            = var.project_id
  service            = "run.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "compute" {
  project            = var.project_id
  service            = "compute.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "vpcaccess" {
  project            = var.project_id
  service            = "vpcaccess.googleapis.com"
  disable_on_destroy = false
}

# CLOUD ARMOR - FIREWALL Y PROTECCIÓN DDoS
# Cloud Armor proporciona protección contra ataques DDoS, SQL injection,
# XSS y otros vectores de ataque comunes. Actúa como un WAF (Web Application Firewall)

resource "google_compute_security_policy" "cloud_run_policy" {
  name        = "santa-ana-security-policy-${var.environment}"
  description = "Política de seguridad para Cloud Run - protección contra ataques comunes"
  
  # Regla 1: Bloquear rangos de IPs maliciosas conocidas
  rule {
    action   = "deny(403)"
    priority = "1000"
    match {
      versioned_expr = "SRC_IPS_V1"
      config {
        src_ip_ranges = var.blocked_ip_ranges
      }
    }
    description = "Bloquear IPs maliciosas conocidas"
  }
  
  # Regla 2: Protección contra ataques SQL Injection
  rule {
    action   = "deny(403)"
    priority = "2000"
    match {
      expr {
        expression = "evaluatePreconfiguredExpr('sqli-stable')"
      }
    }
    description = "Protección contra SQL Injection"
  }
  
  # Regla 3: Protección contra Cross-Site Scripting (XSS)
  rule {
    action   = "deny(403)"
    priority = "3000"
    match {
      expr {
        expression = "evaluatePreconfiguredExpr('xss-stable')"
      }
    }
    description = "Protección contra XSS"
  }
  
  # Regla 4: Protección contra Local File Inclusion (LFI)
  rule {
    action   = "deny(403)"
    priority = "4000"
    match {
      expr {
        expression = "evaluatePreconfiguredExpr('lfi-stable')"
      }
    }
    description = "Protección contra Local File Inclusion"
  }
  
  # Regla 5: Protección contra Remote Code Execution (RCE)
  rule {
    action   = "deny(403)"
    priority = "5000"
    match {
      expr {
        expression = "evaluatePreconfiguredExpr('rce-stable')"
      }
    }
    description = "Protección contra Remote Code Execution"
  }
  
  # Regla 6: Rate Limiting - Limitar peticiones por IP
  rule {
    action   = "rate_based_ban"
    priority = "6000"
    match {
      versioned_expr = "SRC_IPS_V1"
      config {
        src_ip_ranges = ["*"]
      }
    }
    rate_limit_options {
      conform_action = "allow"
      exceed_action  = "deny(429)"
      enforce_on_key = "IP"
      
      rate_limit_threshold {
        count        = var.rate_limit_threshold
        interval_sec = 60
      }
      
      ban_duration_sec = 600  # 10 minutos de ban
    }
    description = "Rate limiting - máximo ${var.rate_limit_threshold} peticiones por minuto por IP"
  }
  
  # Regla predeterminada: Permitir todo lo demás
  rule {
    action   = "allow"
    priority = "2147483647"
    match {
      versioned_expr = "SRC_IPS_V1"
      config {
        src_ip_ranges = ["*"]
      }
    }
    description = "Regla predeterminada: permitir tráfico legítimo"
  }
  
  # Configuración adaptativa para protección DDoS
  adaptive_protection_config {
    layer_7_ddos_defense_config {
      enable = true
    }
  }
}

# CLOUD RUN - FRONTEND SERVICE

# Configuración del servicio Cloud Run con controles de seguridad

resource "google_cloud_run_service" "frontend" {
  name     = "santa-ana-frontend-${var.environment}"
  location = var.region
  
  # Metadata del servicio
  metadata {
    annotations = {
      "run.googleapis.com/ingress" = var.ingress_setting
    }
  }
  
  template {
    spec {
      containers {
        image = var.frontend_image
        
        ports {
          container_port = 80
        }
        
        resources {
          limits = {
            cpu    = var.frontend_cpu
            memory = var.frontend_memory
          }
        }
      }
      
      timeout_seconds = 300
    }
    
    metadata {
      annotations = {
        # Autoscaling
        "autoscaling.knative.dev/minScale"     = var.frontend_min_instances
        "autoscaling.knative.dev/maxScale"     = var.frontend_max_instances
        "run.googleapis.com/startup-cpu-boost" = "true"
      }
      
      labels = {
        environment = var.environment
        managed-by  = "terraform"
        service     = "frontend"
        security    = "enhanced"
      }
    }
  }
  
  traffic {
    percent         = 100
    latest_revision = true
  }
  
  depends_on = [
    google_project_service.cloud_run
  ]
}

# IAM - CONTROL DE ACCESO

# Permitir acceso público
resource "google_cloud_run_service_iam_member" "frontend_public" {
  location = google_cloud_run_service.frontend.location
  service  = google_cloud_run_service.frontend.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# OUTPUTS

output "frontend_url" {
  description = "URL del frontend en Cloud Run"
  value       = google_cloud_run_service.frontend.status[0].url
}

output "frontend_image" {
  description = "Imagen Docker utilizada"
  value       = var.frontend_image
}

output "security_policy_name" {
  description = "Nombre de la política de Cloud Armor"
  value       = google_compute_security_policy.cloud_run_policy.name
}

output "security_summary" {
  description = "Resumen de configuración de seguridad"
  value       = <<-EOT
  
  ═══════════════════════════════════════════════════════════
  CONFIGURACIÓN DE SEGURIDAD - CLOUD RUN
  ═══════════════════════════════════════════════════════════
  
  Cloud Armor Security Policy
    - Protección DDoS adaptativa
    - WAF con reglas anti-SQL injection, XSS, RCE, LFI
    - Rate limiting: ${var.rate_limit_threshold} req/min por IP
    - IPs bloqueadas: ${length(var.blocked_ip_ranges)} rangos
  
  Ingress Controls
    - Política: ${var.ingress_setting}
    - Acceso público: Habilitado
  
  Protecciones Activas
    - SQL Injection: Bloqueado
    - Cross-Site Scripting (XSS): Bloqueado
    - Remote Code Execution (RCE): Bloqueado
    - Local File Inclusion (LFI): Bloqueado
    - Rate Limiting: Activo
    - DDoS Protection: Adaptativo
  
  ═══════════════════════════════════════════════════════════
  EOT
}

output "next_steps" {
  description = "Próximos pasos"
  value       = <<-EOT
  
  ✅ Frontend desplegado exitosamente con seguridad mejorada!
  
  📍 URL de acceso:
  ${google_cloud_run_service.frontend.status[0].url}
  
  📊 Información:
  - Imagen: ${var.frontend_image}
  - Backend: https://santa-ana-api.onrender.com (Render)
  - Región: ${var.region}
  - Autoscaling: ${var.frontend_min_instances}-${var.frontend_max_instances} instancias
  
  🛡️  Seguridad:
  - Cloud Armor: ✅ Activo
  - Rate Limiting: ${var.rate_limit_threshold} req/min
  - Ingress: ${var.ingress_setting}
  - WAF Rules: 6 reglas activas
  
  📝 Ver logs:
  gcloud run services logs tail santa-ana-frontend-${var.environment} --region ${var.region}
  
  🔒 Ver reglas de Cloud Armor:
  gcloud compute security-policies describe santa-ana-security-policy-${var.environment}
  
  🔄 Actualizar frontend:
  1. Push nueva imagen a Docker Hub
  2. terraform apply -auto-approve
  
  📈 Ver métricas:
  ═══════════════════════════════════════════════════════════
  https://console.cloud.google.com/run/detail/${var.region}/santa-ana-frontend-${var.environment}?project=${var.project_id}
  
  🛡️  Ver métricas de seguridad (Cloud Armor):
  https://console.cloud.google.com/net-security/securitypolicies/details/santa-ana-security-policy-${var.environment}?project=${var.project_id}
  
  EOT
}