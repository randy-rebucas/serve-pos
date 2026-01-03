import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import SafeAreaView from '../../components/ui/SafeAreaView';
import { Colors, Spacing, Typography } from '../../constants/Theme';
import { useAuth } from '../../hooks/useAuth';
import { emailPasswordLoginSchema, loginOtpSchema, loginSchema, type EmailPasswordLoginFormData, type LoginFormData, type LoginOtpFormData } from '../../lib/validation/schemas';

export default function LoginScreen() {
  const { sendLoginOtp, verifyLoginOtp, loginWithEmail, enterGuestMode, isLoading, error, clearError, otpSent, resetOtpSent } = useAuth();
  const [countdown, setCountdown] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: '',
      tenantSlug: 'default', // TODO: Get from app config or tenant selection
    },
  });

  const otpForm = useForm<LoginOtpFormData>({
    resolver: zodResolver(loginOtpSchema),
    defaultValues: {
      phone: '',
      otp: '',
      tenantSlug: 'default',
    },
  });

  const emailPasswordForm = useForm<EmailPasswordLoginFormData>({
    resolver: zodResolver(emailPasswordLoginSchema),
    defaultValues: {
      email: '',
      password: '',
      tenantSlug: 'default',
    },
  });

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const onSendOtp = async (data: LoginFormData) => {
    clearError();
    try {
      setPhoneNumber(data.phone);
      await sendLoginOtp(data);
      setCountdown(60); // 60 second countdown
      otpForm.setValue('phone', data.phone);
      otpForm.setValue('tenantSlug', data.tenantSlug);
    } catch (err) {
      console.error('Send OTP error:', err);
    }
  };

  const onVerifyOtp = async (data: LoginOtpFormData) => {
    clearError();
    try {
      await verifyLoginOtp(data);
    } catch (err) {
      console.error('Verify OTP error:', err);
    }
  };

  const onResendOtp = async () => {
    if (countdown > 0) return;
    clearError();
    try {
      await sendLoginOtp({
        phone: phoneNumber,
        tenantSlug: 'default',
      });
      setCountdown(60);
    } catch (err) {
      console.error('Resend OTP error:', err);
    }
  };

  const onEmailPasswordLogin = async (data: EmailPasswordLoginFormData) => {
    clearError();
    try {
      await loginWithEmail(data);
    } catch (err) {
      console.error('Email/password login error:', err);
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
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>

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
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Password"
                      placeholder="Enter your password"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry
                      error={emailPasswordForm.formState.errors.password?.message}
                    />
                  )}
                />

                <Button
                  title="Sign In"
                  onPress={emailPasswordForm.handleSubmit(onEmailPasswordLogin)}
                  variant="primary"
                  style={styles.signInButton}
                  loading={isLoading}
                />

                <View style={styles.signUpContainer}>
                  <Text style={styles.signUpText}>Don&apos;t have an account? </Text>
                  <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                    <Text style={styles.signUpLink}>Sign Up</Text>
                  </TouchableOpacity>
                </View>

                <Button
                  title="Continue as Guest"
                  onPress={enterGuestMode}
                  variant="secondary"
                />
              </>
            ) : !otpSent ? (
              <>
                <Controller
                  control={loginForm.control}
                  name="phone"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Phone Number"
                      placeholder="+1 (555) 123-4567"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="phone-pad"
                      autoCapitalize="none"
                      error={loginForm.formState.errors.phone?.message}
                    />
                  )}
                />

                <Button
                  title="Send OTP"
                  onPress={loginForm.handleSubmit(onSendOtp)}
                  variant="primary"
                  style={styles.signInButton}
                  loading={isLoading}
                />

                <View style={styles.signUpContainer}>
                  <Text style={styles.signUpText}>Don&apos;t have an account? </Text>
                  <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                    <Text style={styles.signUpLink}>Sign Up</Text>
                  </TouchableOpacity>
                </View>

                <Button
                  title="Continue as Guest"
                  onPress={enterGuestMode}
                  variant="secondary"
                />
              </>
            ) : (
              <>
                <View style={styles.otpInfoContainer}>
                  <Text style={styles.otpInfoText}>
                    We&apos;ve sent a 6-digit OTP to{'\n'}
                    <Text style={styles.otpPhoneText}>{phoneNumber}</Text>
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
                  style={styles.signInButton}
                  loading={isLoading}
                />

                <TouchableOpacity
                  onPress={() => {
                    resetOtpSent();
                    otpForm.reset();
                    setCountdown(0);
                  }}
                  style={styles.backToPhoneButton}
                >
                  <Text style={styles.backToPhoneText}>
                    <Ionicons name="arrow-back" size={16} /> Change phone number
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
    marginVertical: Spacing.xl,
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
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
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
  signInButton: {
    marginBottom: Spacing.md,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  signUpText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  signUpLink: {
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
