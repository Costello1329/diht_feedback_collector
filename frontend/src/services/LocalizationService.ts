class LocalizationService {
    // Validation:
    readonly emptyString = (): string =>
        "Это поле обязательно для заполнения.";
    readonly tooShort = (): string =>
        "Слишком мало символов.";
    readonly notValidToken = (): string =>
        "Неверный формат.";
    readonly notValidLogin = (): string =>
        "Разрешены английские буквы, цифры, _ и -.";
    readonly notValidPasswordFirstType = (): string =>
        "Разрешены английские буквы, цифры и символы: _-!@#$%^&*().";
    readonly notValidPasswordSecondType = (): string =>
        "Нужна хотя бы одна строчная буква.";
    readonly notValidPasswordThirdType = (): string =>
        "Нужна хотя бы одна прописная буква.";
    readonly notValidPasswordFourthType = (): string =>
        "Нужна хотя бы одна цифра.";
    readonly notValidPasswordFifthType = (): string =>
        "Нужен хотя бы один символ из _-!@#$%^&*().";
    readonly confirmationDoesNotMatchPassword = () =>
        "Пароли не совпадают.";
    readonly unforseenValidationError = (): string =>
        "Непредвиденная форматная ошибка.";

    // AuthLayout:
    readonly authorizationHeader = (): string =>
        "Авторизация";
    readonly authorizationButton = (): string =>
        "Войти";
    readonly yetNoAccount = (): string =>
        "Нет аккаунта?";
    readonly alreadyHaveAnAccount = (): string =>
        "Уже есть аккаунт?";
    readonly register = (): string =>
        "Зарегистрируйтесь.";
    readonly authorize = (): string =>
        "Авторизируйтесь.";
    readonly login = (): string =>
        "Логин";
    readonly password = (): string =>
        "Пароль";
    readonly confirmation = (): string =>
        "Подтверждение пароля";
    readonly token = (): string =>
        "Токен";
    readonly registrationHeader = (): string =>
        "Регистрация";
    readonly tokenPlaceholder = (): string =>
        "22345200-abe8-4f60-90c8-0d43c5f6c0f6";
    readonly loginPlaceholder = (): string =>
        "Costello1329";
    readonly passwordPlaceholder = (): string =>
        "**********";
    readonly confirmationPlaceholder = (): string =>
        "**********";
    readonly registrate = (): string =>
        "Зарегистрироваться";
    readonly continue = (): string =>
        "Продолжить";
    readonly goBack = (): string =>
        "Назад";
}

export const localization: LocalizationService =
    new LocalizationService();
