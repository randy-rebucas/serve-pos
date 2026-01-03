import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import SafeAreaView from '../../components/ui/SafeAreaView';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Colors, Typography, Spacing } from '../../constants/Theme';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, registerOtpSchema, emailPasswordRegisterSchema, type RegisterFormData, type RegisterOtpFormData, type EmailPasswordRegisterFormData } from '../../lib/validation/schemas';

export default function RegisterScreen() {
  const { register: registerUser, verifyRegisterOtp, registerWithEmail, isLoading, error, clearError, otpSent, resetOtpSent } = useAuth();
  const [countdown, setCountdown] = useState(0);
  const [registrationData, setRegistrationData] = useState<RegisterFormData | null>(null);
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      tenantSlug: 'default', // TODO: Get from app config or tenant selection
      agreeToTerms: false,
    },
  });

  const otpForm = useForm<RegisterOtpFormData>({
    resolver: zodResolver(registerOtpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      otp: '',
      email: '',
      tenantSlug: 'default',
    },
  });

  const emailPasswordForm = useForm<EmailPasswordRegisterFormData>({
    resolver: zodResolver(emailPasswordRegisterSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      tenantSlug: 'default',
      agreeToTerms: false,
    },
  });

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const onSubmit = async (data: RegisterFormData) => {
    clearError();
    try {
      const { agreeToTerms, ...registerData } = data;
      setRegistrationData(data);
      
      // Register will trigger OTP sending
      await registerUser(registerData);
      
      // Set OTP form values
      otpForm.setValue('firstName', data.firstName);
      otpForm.setValue('lastName', data.lastName);
      otpForm.setValue('phone', data.phone);
      otpForm.setValue('email', data.email || '');
      otpForm.setValue('tenantSlug', data.tenantSlug);
      
      setCountdown(60); // 60 second countdown
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  const onVerifyOtp = async (data: RegisterOtpFormData) => {
    clearError();
    try {
      await verifyRegisterOtp(data);
    } catch (err) {
      console.error('Verify OTP error:', err);
    }
  };

  const onResendOtp = async () => {
    if (countdown > 0 || !registrationData) return;
    clearError();
    try {
      const { agreeToTerms, ...registerData } = registrationData;
      await registerUser(registerData);
      setCountdown(60);
    } catch (err) {
      console.error('Resend OTP error:', err);
    }
  };

  const onEmailPasswordRegister = async (data: EmailPasswordRegisterFormData) => {
    clearError();
    try {
      const { agreeToTerms, confirmPassword, ...registerData } = data;
      await registerWithEmail(registerData);
    } catch (err) {
      console.error('Email/password registration error:', err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>[Logo]</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Create Account</Text>

          {/* Auth Method Toggle */}
          <View style={styles.authMethodToggle}>
            <TouchableOpacity
              style={[styles.toggleButton, authMethod === 'phone' && styles.toggleButtonActive]}
              onPress={() => {
                setAuthMethod('phone');
                clearError();
                resetOtpSent();
              }}
            >
              <Text style={[styles.toggleText, authMethod === 'phone' && styles.toggleTextActive]}>
                Phone
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, authMethod === 'email' && styles.toggleButtonActive]}
              onPress={() => {
                setAuthMethod('email');
                clearError();
                resetOtpSent();
              }}
            >
              <Text style={[styles.toggleText, authMethod === 'email' && styles.toggleTextActive]}>
                Email
              </Text>
            </TouchableOpacity>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.form}>
            {authMethod === 'email' ? (
              <>
                <Controller
                  control={emailPasswordForm.control}
                  name="firstName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="First Name"
                      placeholder="John"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={emailPasswordForm.formState.errors.firstName?.message}
                    />
                  )}
                />

                <Controller
                  control={emailPasswordForm.control}
                  name="lastName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Last Name"
                      placeholder="Doe"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={emailPasswordForm.formState.errors.lastName?.message}
                    />
                  )}
                />

                <Controller
                  control={emailPasswordForm.control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Email"
                      placeholder="john@example.com"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      error={emailPasswordForm.formState.errors.email?.message}
                    />
                  )}
                />

                <Controller
                  control={emailPasswordForm.control}
                  name="phone"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Phone Number (Optional)"
                      placeholder="+1 (555) 123-4567"
                      value={value || ''}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="phone-pad"
                      error={emailPasswordForm.formState.errors.phone?.message}
                    />
                  )}
                />

                <Controller
                  control={emailPasswordForm.control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Password"
                      placeholder="At least 6 characters"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry
                      error={emailPasswordForm.formState.errors.password?.message}
                    />
                  )}
                />

                <Controller
                  control={emailPasswordForm.control}
                  name="confirmPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Confirm Password"
                      placeholder="Re-enter your password"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry
                      error={emailPasswordForm.formState.errors.confirmPassword?.message}
                    />
                  )}
                />

                <Controller
                  control={emailPasswordForm.control}
                  name="agreeToTerms"
                  render={({ field: { onChange, value } }) => (
                    <TouchableOpacity
                      style={styles.checkboxContainer}
                      onPress={() => onChange(!value)}
                    >
                      <View style={[styles.checkbox, value && styles.checkboxChecked]}>
                        {value && <Ionicons name="checkmark" size={16} color={Colors.surface} />}
                      </View>
                      <Text style={styles.checkboxLabel}>
                        I agree to Terms & Conditions
                      </Text>
                    </TouchableOpacity>
                  )}
                />
                {emailPasswordForm.formState.errors.agreeToTerms && (
                  <Text style={styles.errorText}>{emailPasswordForm.formState.errors.agreeToTerms.message}</Text>
                )}

                <Button
                  title="Create Account"
                  onPress={emailPasswordForm.handleSubmit(onEmailPasswordRegister)}
                  variant="primary"
                  style={styles.createButton}
                  loading={isLoading}
                />

                <View style={styles.signInContainer}>
                  <Text style={styles.signInText}>Already have account? </Text>
                  <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                    <Text style={styles.signInLink}>Sign In</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : !otpSent ? (
              <>
                <Controller
                  control={registerForm.control}
                  name="firstName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="First Name"
                      placeholder="John"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={registerForm.formState.errors.firstName?.message}
                    />
                  )}
                />

                <Controller
                  control={registerForm.control}
                  name="lastName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Last Name"
                      placeholder="Doe"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={registerForm.formState.errors.lastName?.message}
                    />
                  )}
                />

                <Controller
                  control={registerForm.control}
                  name="phone"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Phone Number"
                      placeholder="+1 (555) 123-4567"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="phone-pad"
                      error={registerForm.formState.errors.phone?.message}
                    />
                  )}
                />

                <Controller
                  control={registerForm.control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Email (Optional)"
                      placeholder="john@example.com"
                      value={value || ''}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      error={registerForm.formState.errors.email?.message}
                    />
                  )}
                />

                <Controller
                  control={registerForm.control}
                  name="agreeToTerms"
                  render={({ field: { onChange, value } }) => (
                    <TouchableOpacity
                      style={styles.checkboxContainer}
                      onPress={() => onChange(!value)}
                    >
                      <View style={[styles.checkbox, value && styles.checkboxChecked]}>
                        {value && <Ionicons name="checkmark" size={16} color={Colors.surface} />}
                      </View>
                      <Text style={styles.checkboxLabel}>
                        I agree to Terms & Conditions
                      </Text>
                    </TouchableOpacity>
                  )}
                />
                {registerForm.formState.errors.agreeToTerms && (
                  <Text style={styles.errorText}>{registerForm.formState.errors.agreeToTerms.message}</Text>
                )}

                <Button
                  title="Create Account"
                  onPress={registerForm.handleSubmit(onSubmit)}
                  variant="primary"
                  style={styles.createButton}
                  loading={isLoading}
                />

                <View style={styles.signInContainer}>
                  <Text style={styles.signInText}>Already have account? </Text>
                  <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                    <Text style={styles.signInLink}>Sign In</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <View style={styles.otpInfoContainer}>
                  <Text style={styles.otpInfoText}>
                    We&apos;ve sent a 6-digit OTP to{'\n'}
                    <Text style={styles.otpPhoneText}>{registrationData?.phone}</Text>
                  </Text>
                </View>

                <Controller
                  control={otpForm.control}
                  name="otp"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Enter OTP"
                      placeholder="123456"
                      value={value}
                      onChangeText={(text) => {
                        // Only allow digits and limit to 6
                        const digits = text.replace(/\D/g, '').slice(0, 6);
                        onChange(digits);
                      }}
                      onBlur={onBlur}
                      keyboardType="number-pad"
                      maxLength={6}
                      error={otpForm.formState.errors.otp?.message}
                    />
                  )}
                />

                <View style={styles.resendContainer}>
                  <Text style={styles.resendText}>Didn&apos;t receive the code? </Text>
                  <TouchableOpacity
                    onPress={onResendOtp}
                    disabled={countdown > 0}
                    style={countdown > 0 && styles.resendDisabled}
                  >
                    <Text
                      style={[
                        styles.resendLink,
                        countdown > 0 && styles.resendLinkDisabled,
                      ]}
                    >
                      {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <Button
                  title="Verify OTP"
                  onPress={otpForm.handleSubmit(onVerifyOtp)}
                  variant="primary"
                  style={styles.createButton}
                  loading={isLoading}
                />

                <TouchableOpacity
                  onPress={() => {
                    resetOtpSent();
                    otpForm.reset();
                    setCountdown(0);
                    setRegistrationData(null);
                  }}
                  style={styles.backToPhoneButton}
                >
                  <Text style={styles.backToPhoneText}>
                    <Ionicons name="arrow-back" size={16} /> Back to registration
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Spacing.lg,
  },
  backButton: {
    marginBottom: Spacing.md,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: Colors.border,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  content: {
    flex: 1,
  },
  title: {
    ...Typography.h2,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  errorContainer: {
    backgroundColor: Colors.error + '20',
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.md,
  },
  errorText: {
    ...Typography.body,
    color: Colors.error,
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  otpInfoContainer: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  otpInfoText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  otpPhoneText: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  resendText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  resendLink: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
  },
  resendLinkDisabled: {
    color: Colors.textSecondary,
  },
  resendDisabled: {
    opacity: 0.5,
  },
  backToPhoneButton: {
    marginTop: Spacing.md,
    alignItems: 'center',
  },
  backToPhoneText: {
    ...Typography.body,
    color: Colors.primary,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.xl,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 4,
    marginRight: Spacing.sm,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkboxLabel: {
    ...Typography.body,
    color: Colors.textPrimary,
    flex: 1,
  },
  createButton: {
    marginBottom: Spacing.md,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signInText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  signInLink: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
  },
  authMethodToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 4,
    marginBottom: Spacing.lg,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 6,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: Colors.primary,
  },
  toggleText: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  toggleTextActive: {
    color: Colors.surface,
    fontWeight: '600',
  },
});
