import { authHandlers }      from './auth.handlers'
import { citasHandlers }     from './citas.handlers'
import { serviciosHandlers } from './servicios.handlers'
import { empleadosHandlers } from './empleados.handlers'
import { clientesHandlers }  from './clientes.handlers'
import { pagosHandlers }     from './pagos.handlers'

export const handlers = [
  ...authHandlers,
  ...citasHandlers,
  ...serviciosHandlers,
  ...empleadosHandlers,
  ...clientesHandlers,
  ...pagosHandlers,
]
