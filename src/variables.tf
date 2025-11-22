# PROYECTO Y REGIÓN

variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP Region"
  type        = string
  default     = "us-central1"
}

variable "environment" {
  description = "Environment name (dev, prod)"
  type        = string
  default     = "prod"
}

# FRONTEND IMAGE

variable "frontend_image" {
  description = "Frontend Docker image"
  type        = string
  default     = "mariogm45/santa-ana-frontend:latest"
}

# CLOUD RUN - FRONTEND RESOURCES

variable "frontend_cpu" {
  description = "Frontend CPU allocation"
  type        = string
  default     = "1000m"
}

variable "frontend_memory" {
  description = "Frontend memory allocation"
  type        = string
  default     = "512Mi"
}

variable "frontend_min_instances" {
  description = "Frontend minimum instances"
  type        = string
  default     = "0"
}

variable "frontend_max_instances" {
  description = "Frontend maximum instances"
  type        = string
  default     = "5"
}

# FIREWALL Y POLÍTICAS DE SEGURIDAD

variable "ingress_setting" {
  description = <<-EOT
    Control de tráfico entrante a Cloud Run.
    Opciones:
    - "all": Permite todo el tráfico de Internet (público)
    - "internal": Solo tráfico desde la misma VPC
    - "internal-and-cloud-load-balancing": VPC + Load Balancer
  EOT
  type        = string
  default     = "all"
  
  validation {
    condition     = contains(["all", "internal", "internal-and-cloud-load-balancing"], var.ingress_setting)
    error_message = "ingress_setting debe ser 'all', 'internal', o 'internal-and-cloud-load-balancing'"
  }
}

# CLOUD ARMOR - PROTECCIÓN DDoS Y WAF

variable "rate_limit_threshold" {
  description = "Número máximo de peticiones por minuto por IP antes de aplicar rate limiting"
  type        = number
  default     = 100
  
  validation {
    condition     = var.rate_limit_threshold > 0 && var.rate_limit_threshold <= 10000
    error_message = "rate_limit_threshold debe estar entre 1 y 10000"
  }
}

variable "blocked_ip_ranges" {
  description = <<-EOT
    Lista de rangos de IP a bloquear.
    Puedes agregar IPs de ataques conocidos o países específicos.
    Formato CIDR: ["1.2.3.4/32", "10.0.0.0/8"]
  EOT
  type        = list(string)
  default     = ["192.0.2.0/24"] 
}