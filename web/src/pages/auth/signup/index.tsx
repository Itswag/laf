import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useColorMode,
} from "@chakra-ui/react";
import clsx from "clsx";
import { t } from "i18next";

import { OutlineViewOffIcon, OutlineViewOnIcon } from "@/components/CommonIcon";
import { Logo, LogoText } from "@/components/LogoIcon";
import { Routes } from "@/constants";
import { COLOR_MODE } from "@/constants";

import useInviteCode from "@/hooks/useInviteCode";
import { useGroupMemberAddMutation } from "@/pages/app/collaboration/service";
import {
  useGetProvidersQuery,
  useSendSmsCodeMutation,
  useSignupMutation,
} from "@/pages/auth/service";
import useAuthStore from "@/pages/auth/store";
import useGlobalStore from "@/pages/globalStore";

type FormData = {
  phone?: string;
  validationCode?: string;
  account: string;
  password: string;
  confirmPassword: string;
};

export default function SignUp() {
  const signupMutation = useSignupMutation();
  const sendSmsCodeMutation = useSendSmsCodeMutation();
  const [isNeedPhone, setIsNeedPhone] = useState(false);
  const { providers, setProviders } = useAuthStore();

  const { colorMode } = useColorMode();
  const darkMode = colorMode === COLOR_MODE.dark;

  useGetProvidersQuery((data: any) => {
    setProviders(data?.data || []);
  });

  useEffect(() => {
    if (providers.length) {
      const passwordProvider = providers.find((provider) => provider.name === "user-password");
      if (passwordProvider) {
        setIsNeedPhone(passwordProvider.bind?.phone === "required");
      }
    }
  }, [providers]);

  const { showSuccess, showError } = useGlobalStore();
  const navigate = useNavigate();

  const [agreement, setAgreement] = useState(false);
  const [isSendSmsCode, setIsSendSmsCode] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const joinGroupMutation = useGroupMemberAddMutation();
  const inviteCode = useInviteCode();

  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      phone: "",
      validationCode: "",
      account: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    if (data.password !== data.confirmPassword) {
      showError(t("AuthPanel.PasswordNotMatch"));
      return;
    }

    const params = isNeedPhone
      ? {
          phone: data.phone,
          code: data.validationCode,
          username: data.account,
          password: data.password,
          inviteCode: inviteCode,
          type: "Signup",
        }
      : {
          username: data.account,
          password: data.password,
          inviteCode: inviteCode,
          type: "Signup",
        };

    const res = await signupMutation.mutateAsync(params);

    if (res?.data) {
      const sessionData = sessionStorage.getItem("collaborationCode");
      const collaborationCode = JSON.parse(sessionData || "{}");
      sessionStorage.removeItem("collaborationCode");
      if (sessionData) {
        const res = await joinGroupMutation.mutateAsync({ code: collaborationCode.code });
        if (!res.error) {
          showSuccess(t("Collaborate.JoinSuccess"));
        }
        navigate(`/app/${collaborationCode.appid}/function`);
      } else {
        navigate(Routes.dashboard, { replace: true });
      }
    }
  };

  const handleSendSmsCode = async () => {
    if (isSendSmsCode) {
      return;
    }

    const phone = getValues("phone") || "";
    const isValidate = /^1[2-9]\d{9}$/.test(phone);
    if (!isValidate) {
      showError(t("AuthPanel.PhoneTip"));
      return;
    }

    switchSmsCodeStatus();

    const res = await sendSmsCodeMutation.mutateAsync({
      phone,
      type: "Signup",
    });

    if (res?.data) {
      showSuccess(t("AuthPanel.SmsCodeSendSuccess"));
    }
  };

  const switchSmsCodeStatus = () => {
    setIsSendSmsCode(true);
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((countdown) => {
        if (countdown === 0) {
          clearInterval(timer);
          setIsSendSmsCode(false);
          return 0;
        }
        return countdown - 1;
      });
    }, 1000);
  };

  return (
    <div
      className={clsx(
        "absolute right-[125px] top-1/2 h-[680px] w-[560px] -translate-y-1/2 rounded-3xl px-16 pt-[78px]",
        { "bg-white": !darkMode, "bg-lafDark-100": darkMode },
      )}
    >
      <div className="mb-9 flex items-center space-x-4">
        <Logo size="43px" outerColor="#33BABB" innerColor="white" />
        <LogoText size="51px" color={darkMode ? "#33BABB" : "#363C42"} />
      </div>
      <div>
        <FormControl isInvalid={!!errors.account} className="mb-6 flex items-center">
          <FormLabel className={darkMode ? "w-20" : "w-20 text-grayModern-700"} htmlFor="account">
            {t("AuthPanel.Account")}
          </FormLabel>
          <Input
            {...register("account", { required: true })}
            id="account"
            placeholder={t("AuthPanel.AccountPlaceholder") || ""}
            bg={darkMode ? "#363C42" : "#F8FAFB"}
            border={darkMode ? "1px solid #24282C" : "1px solid #D5D6E1"}
            height="48px"
            rounded="4px"
          />
        </FormControl>
        <FormControl isInvalid={!!errors.password} className="mb-6 flex items-center">
          <FormLabel className={darkMode ? "w-20" : "w-20 text-grayModern-700"} htmlFor="password">
            {t("AuthPanel.Password")}
          </FormLabel>
          <InputGroup>
            <Input
              type={isShowPassword ? "text" : "password"}
              {...register("password", {
                required: true,
              })}
              id="password"
              placeholder={t("AuthPanel.PasswordPlaceholder") || ""}
              bg={darkMode ? "#363C42" : "#F8FAFB"}
              border={darkMode ? "1px solid #24282C" : "1px solid #D5D6E1"}
              height="48px"
              rounded="4px"
            />
            <InputRightElement width="2rem" height="100%">
              {isShowPassword ? (
                <OutlineViewOffIcon
                  className="cursor-pointer !text-primary-500"
                  onClick={() => setIsShowPassword(false)}
                />
              ) : (
                <OutlineViewOnIcon
                  className="cursor-pointer !text-primary-500"
                  onClick={() => setIsShowPassword(true)}
                />
              )}
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl isInvalid={!!errors.confirmPassword} className="mb-6 flex items-center">
          <FormLabel
            className={darkMode ? "w-20" : "w-20 text-grayModern-700"}
            htmlFor="confirmPassword"
          >
            {t("AuthPanel.ConfirmPassword")}
          </FormLabel>
          <InputGroup>
            <Input
              type={isShowPassword ? "text" : "password"}
              {...register("confirmPassword", {
                required: true,
              })}
              id="confirmPassword"
              placeholder={t("AuthPanel.ConfirmPassword") || ""}
              bg={darkMode ? "#363C42" : "#F8FAFB"}
              border={darkMode ? "1px solid #24282C" : "1px solid #D5D6E1"}
              height="48px"
              rounded="4px"
            />
            <InputRightElement width="2rem" height="100%">
              {isShowPassword ? (
                <OutlineViewOffIcon
                  className="cursor-pointer !text-primary-500"
                  onClick={() => setIsShowPassword(false)}
                />
              ) : (
                <OutlineViewOnIcon
                  className="cursor-pointer !text-primary-500"
                  onClick={() => setIsShowPassword(true)}
                />
              )}
            </InputRightElement>
          </InputGroup>
        </FormControl>
        {isNeedPhone && (
          <FormControl isInvalid={!!errors?.phone} className="mb-6 flex items-center">
            <FormLabel className={darkMode ? "w-20" : "w-20 text-grayModern-700"} htmlFor="phone">
              {t("AuthPanel.Phone")}
            </FormLabel>
            <InputGroup>
              <Input
                {...register("phone", {
                  required: true,
                  pattern: {
                    value: /^1[2-9]\d{9}$/,
                    message: t("AuthPanel.PhoneTip"),
                  },
                })}
                type="tel"
                id="phone"
                placeholder={t("AuthPanel.PhonePlaceholder") || ""}
                bg={darkMode ? "#363C42" : "#F8FAFB"}
                border={darkMode ? "1px solid #24282C" : "1px solid #D5D6E1"}
                height="48px"
                rounded="4px"
              />
              <InputRightElement width="6rem" height="100%">
                <Button
                  className="w-20"
                  variant={isSendSmsCode ? "text_disabled" : "text"}
                  onClick={handleSendSmsCode}
                >
                  {isSendSmsCode ? `${countdown}s` : t("AuthPanel.getValidationCode")}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
        )}
        {isNeedPhone && (
          <FormControl isInvalid={!!errors.validationCode} className="mb-10 flex items-center">
            <FormLabel
              className={darkMode ? "w-20" : "w-20 text-grayModern-700"}
              htmlFor="validationCode"
            >
              {t("AuthPanel.ValidationCode")}
            </FormLabel>
            <Input
              type="number"
              {...register("validationCode", {
                required: true,
                pattern: {
                  value: /^\d{6}$/,
                  message: t("AuthPanel.ValidationCodePlaceholder"),
                },
              })}
              id="validationCode"
              placeholder={t("AuthPanel.ValidationCodePlaceholder") || ""}
              bg={darkMode ? "#363C42" : "#F8FAFB"}
              border={darkMode ? "1px solid #24282C" : "1px solid #D5D6E1"}
              height="48px"
              rounded="4px"
            />
          </FormControl>
        )}
        {false && (
          <div className="mb-6 flex items-center">
            <CheckboxGroup>
              <Checkbox
                onChange={(e) => setAgreement(e.target.checked)}
                isChecked={agreement}
                colorScheme="primary"
              />
            </CheckboxGroup>
            <span className="ml-1 text-[14px] text-[#333333]">
              我已阅读并同意{" "}
              <a href="laf.dev" className="text-[#33BAB1]">
                服务协议
              </a>{" "}
              和{" "}
              <a href="laf.dev" className="text-[#33BAB1]">
                隐私协议
              </a>
            </span>
          </div>
        )}
        <div className="mb-6">
          <Button
            type="submit"
            className="!h-[42px] w-full !bg-primary-500 hover:!bg-primary-600"
            isLoading={signupMutation.isLoading}
            onClick={handleSubmit(onSubmit)}
          >
            {t("AuthPanel.Register")}
          </Button>
        </div>
        <div className="mt-5 flex justify-end">
          <Button
            className="!px-2 text-lg"
            variant={"text"}
            onClick={() => navigate("/login", { replace: true })}
          >
            {t("AuthPanel.ToLogin")}
          </Button>
        </div>
      </div>
    </div>
  );
}
