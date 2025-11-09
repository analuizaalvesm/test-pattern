export class CarrinhoBuilder {
  constructor() {
    this.user = {
      nome: "Usuário Teste",
      email: "teste@email.com",
      tipo: "COMUM",
      isPremium() {
        return this.tipo === "PREMIUM";
      },
    };
    this.itens = [{ nome: "Produto 1", preco: 100 }];
  }

  comUser(user) {
    this.user = user;
    return this;
  }

  comItens(itens) {
    this.itens = itens;
    return this;
  }

  vazio() {
    this.itens = [];
    return this;
  }

  build() {
    return {
      user: this.user,
      itens: this.itens,
      calcularTotal: () => this.itens.reduce((acc, i) => acc + i.preco, 0),
    };
  }
}
