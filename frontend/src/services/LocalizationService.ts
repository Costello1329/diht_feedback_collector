class LocalizationService {
    // Authorization layout:
    readonly authorizationHeader = () => "Авторизация";
    readonly authorizationButton = () => "Войти";


    // Registration layout:
    readonly registrationHeader = () => "Регистрация";
    readonly tokenPlaceholder = () => "22345200-abe8-4f60-90c8-0d43c5f6c0f6";
    readonly loginPlaceholder = () => "Costello1329";
    readonly passwordPlaceholder = () => "password";
    readonly confirmationPlaceholder = () => "password";
    readonly registrationButton = () => "Зарегистрироваться";
    readonly continueButton = () => "Продолжить";
}

export const localization = new LocalizationService();
