export class UserMother {
  static umUsuarioPadrao() {
    return {
      nome: "Usuário Padrão",
      email: "usuario@email.com",
      tipo: "COMUM",
      isPremium() {
        return this.tipo === "PREMIUM";
      },
    };
  }

  static umUsuarioPremium() {
    return {
      nome: "Usuário Premium",
      email: "premium@email.com",
      tipo: "PREMIUM",
      isPremium() {
        return this.tipo === "PREMIUM";
      },
    };
  }
}
