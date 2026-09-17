import { Cita, ConfiguracionMarcaBlanca } from '@/types'

export function imprimirOguardarComprobantePDF(
  cita: Cita,
  configuracion: ConfiguracionMarcaBlanca,
  folio: string
): void {
  const nombreNegocio = configuracion.nombre_negocio || 'Sagitta Studio'
  const telefono = configuracion.telefono_soporte || '+1 555-0900'
  const email = configuracion.email_soporte || 'contacto@sagitta.app'
  const direccion = 'Sede Principal • Av. Central 405'
  const simbolo = configuracion.simbolo_moneda || '$'
  const precio = `${simbolo}${Number(cita.precio_total || cita.servicio?.precio_base || 25).toFixed(2)}`

  const contenidoHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Comprobante de Cita - ${folio}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #f8fafc;
      color: #0f172a;
      display: flex;
      justify-content: center;
      padding: 24px 16px;
    }
    .ticket {
      background: #ffffff;
      max-width: 420px;
      width: 100%;
      border-radius: 24px;
      padding: 32px 24px;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
      border: 1px solid #e2e8f0;
      text-align: center;
    }
    .badge {
      display: inline-block;
      background: #ecfdf5;
      color: #059669;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 9999px;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .logo {
      font-size: 22px;
      font-weight: 900;
      color: #4f46e5;
      letter-spacing: -0.02em;
      margin-bottom: 4px;
    }
    .lema {
      font-size: 12px;
      color: #64748b;
      margin-bottom: 20px;
    }
    .divider {
      border-top: 2px dashed #e2e8f0;
      margin: 20px 0;
      position: relative;
    }
    .folio {
      font-family: monospace;
      font-size: 14px;
      font-weight: 800;
      background: #f1f5f9;
      padding: 6px 12px;
      border-radius: 12px;
      display: inline-block;
      color: #334155;
      margin-bottom: 16px;
    }
    .row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      font-size: 13px;
      border-bottom: 1px solid #f8fafc;
    }
    .row .label {
      color: #64748b;
      font-weight: 500;
      text-align: left;
    }
    .row .val {
      font-weight: 700;
      color: #0f172a;
      text-align: right;
    }
    .total-box {
      margin-top: 16px;
      padding: 14px;
      background: #f8fafc;
      border-radius: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .total-title {
      font-size: 13px;
      font-weight: 700;
      color: #475569;
    }
    .total-val {
      font-size: 20px;
      font-weight: 900;
      color: #4f46e5;
    }
    .footer-note {
      font-size: 11px;
      color: #94a3b8;
      margin-top: 20px;
      line-height: 1.5;
    }
    .actions {
      margin-top: 24px;
      display: flex;
      gap: 10px;
    }
    .btn {
      flex: 1;
      padding: 12px;
      border-radius: 14px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      border: none;
      transition: opacity 0.2s;
    }
    .btn-primary {
      background: #4f46e5;
      color: #ffffff;
    }
    .btn-secondary {
      background: #e2e8f0;
      color: #334155;
    }
    @media print {
      body { background: #ffffff; padding: 0; }
      .ticket { box-shadow: none; border: 1px solid #cbd5e1; max-width: 100%; }
      .actions { display: none; }
    }
  </style>
</head>
<body>
  <div class="ticket">
    <span class="badge">✓ Turno Confirmado</span>
    <h1 class="logo">${nombreNegocio}</h1>
    <p class="lema">${configuracion.lema_negocio || 'Comprobante Oficial de Reserva'}</p>

    <div class="folio">FOLIO: ${folio}</div>

    <div class="row">
      <span class="label">Cliente:</span>
      <span class="val">${cita.cliente?.nombre || 'Cliente'}</span>
    </div>
    <div class="row">
      <span class="label">Teléfono:</span>
      <span class="val">${cita.cliente?.telefono || 'Registrado'}</span>
    </div>
    <div class="row">
      <span class="label">Servicio:</span>
      <span class="val">${cita.servicio?.nombre || 'Servicio General'}</span>
    </div>
    <div class="row">
      <span class="label">Especialista:</span>
      <span class="val">${cita.empleado?.nombre || 'Especialista de Turno'}</span>
    </div>
    <div class="row">
      <span class="label">Fecha y Hora:</span>
      <span class="val">${cita.fecha_inicio.slice(0, 16)} hrs</span>
    </div>
    <div class="row">
      <span class="label">Dirección:</span>
      <span class="val">${direccion}</span>
    </div>

    <div class="total-box">
      <span class="total-title">Total a abonar en tienda:</span>
      <span class="total-val">${precio}</span>
    </div>

    <div class="divider"></div>

    <p class="footer-note">
      Por favor preséntate 5 minutos antes de tu cita.<br>
      Soporte: ${telefono} • ${email}
    </p>

    <div class="actions">
      <button class="btn btn-primary" onclick="window.print()">🖨️ Guardar PDF / Imprimir</button>
      <button class="btn btn-secondary" onclick="window.close()">Cerrar</button>
    </div>
  </div>

  <script>
    // Auto-disparar print en dispositivos móviles si se desea
    setTimeout(() => {
      // window.print();
    }, 400);
  </script>
</body>
</html>`

  const blob = new Blob([contenidoHtml], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const win = window.open(url, '_blank')
  if (!win) {
    // Si el bloqueador de popups bloquea window.open, descargamos o abrimos vía iframe
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    iframe.src = url
    document.body.appendChild(iframe)
    setTimeout(() => {
      iframe.contentWindow?.print()
    }, 500)
  }
}

