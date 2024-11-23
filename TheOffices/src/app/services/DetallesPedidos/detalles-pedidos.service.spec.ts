import { TestBed } from '@angular/core/testing';

import { DetallesPedidosService } from './detalles-pedidos.service';

describe('DetallesPedidosService', () => {
  let service: DetallesPedidosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetallesPedidosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
