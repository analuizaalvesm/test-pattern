import { CheckoutService } from "../src/services/CheckoutService.js";
import { UserMother } from "./builders/UserMother.js";
import { CarrinhoBuilder } from "./builders/CarrinhoBuilder.js";

describe("CheckoutService", () => {
  describe("quando o pagamento falha", () => {
    test("deve retornar null (verificação de estado)", async () => {
      const carrinho = new CarrinhoBuilder().build();
      const gatewayStub = {
        cobrar: jest.fn().mockResolvedValue({ success: false }),
      };
      const repositoryDummy = { salvar: jest.fn() };
      const emailDummy = { enviarEmail: jest.fn() };

      const checkoutService = new CheckoutService(
        gatewayStub,
        repositoryDummy,
        emailDummy
      );

      const pedido = await checkoutService.processarPedido(
        carrinho,
        "1234-xxxx"
      );

      expect(pedido).toBeNull();
      expect(repositoryDummy.salvar).not.toHaveBeenCalled();
      expect(emailDummy.enviarEmail).not.toHaveBeenCalled();
    });
  });

  describe("quando um cliente Premium finaliza a compra", () => {
    test("deve aplicar desconto e enviar e-mail (verificação de comportamento)", async () => {
      const userPremium = UserMother.umUsuarioPremium();
      const carrinho = new CarrinhoBuilder()
        .comUser(userPremium)
        .comItens([{ nome: "Item A", preco: 200 }])
        .build();

      const gatewayStub = {
        cobrar: jest.fn().mockResolvedValue({ success: true }),
      };
      const pedidoSalvo = { id: 1, total: 180 };
      const repositoryStub = {
        salvar: jest.fn().mockResolvedValue(pedidoSalvo),
      };
      const emailMock = { enviarEmail: jest.fn().mockResolvedValue(true) };

      const checkoutService = new CheckoutService(
        gatewayStub,
        repositoryStub,
        emailMock
      );

      const pedido = await checkoutService.processarPedido(
        carrinho,
        "5555-xxxx"
      );

      expect(gatewayStub.cobrar).toHaveBeenCalledWith(180, "5555-xxxx");
      expect(repositoryStub.salvar).toHaveBeenCalled();
      expect(emailMock.enviarEmail).toHaveBeenCalledTimes(1);
      expect(emailMock.enviarEmail).toHaveBeenCalledWith(
        "premium@email.com",
        "Seu Pedido foi Aprovado!",
        expect.stringContaining("R$180")
      );
      expect(pedido).toEqual(pedidoSalvo);
    });
  });
});
