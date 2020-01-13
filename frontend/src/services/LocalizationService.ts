class LocalizationService {
    // Validation:
    readonly emptyString = (): string =>
        "Это поле обязательно для заполнения.";
    readonly tooShort = (): string =>
        "Слишком мало символов.";
    readonly notValidToken = (): string =>
        "Неверный формат токена.";
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
    readonly performRegistration = (): string =>
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

    readonly registrationSuccessLabel = (): string =>
        "Регистрация успешна";
    readonly registrationErrorLabel = (): string =>
        "Ошибка регистрации";
    readonly userRegistrated = (): string =>
        "Пользователь зарегистрирован.";

    readonly authorizationErrorLabel = (): string =>
        "Ошибка авторизации";

    readonly tokenDoesNotExist = (): string =>
        "Токена не существует.";
    readonly loginDoesNotExist = (): string =>
        "Логина не существует.";
    readonly passwordIsIncorrect = (): string =>
        "Неверный пароль.";
    readonly tokenAlreadyActivated = (): string =>
        "Токен уже был активирован.";
    readonly loginAlreadyTaken = (): string =>
        "Выбранный вами логин уже занят.";
    readonly contractError = (): string =>
        "Нарушение контракта: недопустимые данные.";
    readonly validationError = (): string =>
        "Недопустимые данные: данные не прошли валидацию на сервере.";
    readonly internalServerError = (): string =>
        "Произошла внутренняя ошибка со стороны сервера.";
    readonly userErrorLabel = (): string =>
        "Ошибка получения пользователя";
    readonly userWasNotAuthorized = (): string =>
        "Пользователь не был авторизован. Скорее всего сессия устарела.";

    readonly logoutErrorLabel = (): string =>
        "Ошибка выхода.";
}

export const localization: LocalizationService =
    new LocalizationService();
