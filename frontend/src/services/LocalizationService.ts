class LocalizationService {
    // Validation:
    readonly emptyString = () =>
        "Это поле обязательно для заполнения.";
    readonly tooShort = () =>
        "Слишком мало символов.";
    readonly notValidToken = () =>
        "Неверный формат.";
    readonly notValidLogin = () =>
        "Разрешены английские буквы, цифры, _ и -.";
    readonly notValidPasswordFirstType = () =>
        "Разрешены английские буквы, цифры и символы: _-!@#$%^&*().";
    readonly notValidPasswordSecondType = () =>
        "Нужна хотя бы одна строчная буква.";
    readonly notValidPasswordThirdType = () =>
        "Нужна хотя бы одна прописная буква.";
    readonly notValidPasswordFourthType = () =>
        "Нужна хотя бы одна цифра.";
    readonly notValidPasswordFifthType = () =>
        "Нужен хотя бы один символ из _-!@#$%^&*().";
    readonly confirmationDoesNotMatchPassword = () =>
        "Пароли не совпадают.";
    readonly unforseenValidationError = () =>
        "Непредвиденная форматная ошибка.";

    // AuthLayout:
    readonly authorizationHeader = () => "Авторизация";
    readonly authorizationButton = () => "Войти";
    readonly yetNoAccount = () => "Нет аккаунта?";
    readonly alreadyHaveAnAccount = () => "Уже есть аккаунт?";
    readonly register = () => "Зарегистрируйтесь.";
    readonly authorize = () => "Авторизируйтесь.";
    readonly login = () => "Логин";
    readonly password = () => "Пароль";
    readonly confirmation = () => "Подтверждение пароля";
    readonly token = () => "Токен";
    readonly registrationHeader = () => "Регистрация";
    readonly tokenPlaceholder = () => "22345200-abe8-4f60-90c8-0d43c5f6c0f6";
    readonly loginPlaceholder = () => "Costello1329";
    readonly passwordPlaceholder = () => "**********";
    readonly confirmationPlaceholder = () => "**********";
    readonly registrate = () => "Зарегистрироваться";
    readonly continue = () => "Продолжить";
    readonly goBack = () => "Назад";
}

export const localization = new LocalizationService();
