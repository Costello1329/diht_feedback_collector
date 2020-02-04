class LocalizationService {
  // Main:
  readonly mainTitle = (): string =>
    "DIHT Feedback Collector";
  readonly development = (): string =>
    "Разработка";
  readonly developers = (): string[] => [
    "Константин Леладзе",
    "Кирилл Семенников",
    "Александр Харитонов"
  ]

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

  //PollboardLayout
  readonly myAnswer = (): string =>
    "Мой ответ";
  readonly answerEdition = (): string =>
    "Редактирование ответа";
  readonly lectures = (): string =>
    "Лекции";
  readonly attendedLectures = (): string =>
    "Посещали лекции?";
  readonly evaluateQualityOfLectures = (): string =>
    "Оцените качество лекций";
  readonly goodAboutLectures = (): string =>
    "Что было хорошо в лекциях?";
  readonly badAboutLectures = (): string =>
    "Что было плохо в лекциях?";
  readonly suggestionAboutLectures = (): string =>
    "Предложения по ведению лекций";
  readonly seminars = (): string =>
    "Семинары";
  readonly yourTeacherAndAssist = (): string =>
    "Ваш семинарист и ассистент";
  readonly evaluateQualityOfSeminars = (): string =>
    "Оцените качество семинаров";
  readonly goodAboutSeminars = (): string =>
    "Что было хорошо в семинарах?";
  readonly badAboutSeminars = (): string =>
    "Что было плохо в семинарах?";
  readonly suggestionAboutSeminars = (): string =>
    "Предложения по ведению семинаров";

  //dashboard
  readonly dashboardErrorLabel = (): string =>
    "Ошибка получения опросов";
  readonly pollErrorLabel = (): string =>
    "Ошибка сохранения ответа";
  readonly pollNotStarted = (): string =>
    "Опрос пока что не был пройден";
  readonly pollStarted = (): string =>
    "Ответ заполнен частично";
  readonly pollFinished = (): string =>
    "Ответ заполнен полностью";
  readonly startPoll = (): string =>
    "Начать заполнение";
  readonly editPoll = (): string =>
    "Редактировать ответ";
  readonly viewPoll = (): string =>
    "Просмотреть ответ";
  readonly pollSuccessLabel = (): string =>
    "Опрос сохранен.";
  readonly pollSaved = (): string =>
    "Данные получены базой данных.";
  readonly exit = (): string =>
    "Выйти";
  readonly availableCourses = (): string =>
    "Доступные опросы по пройденным курсам";
  readonly pollFillingStatusNotStarted = (): string =>
    "Опрос не был пройден.";
  readonly pollFillingStatusInProcess = (): string =>
    "Опрос заполнен частично.";
  readonly pollFillingStatusFinished = (): string =>
    "Опрос пройден.";
}

export const localization: LocalizationService =
    new LocalizationService();
